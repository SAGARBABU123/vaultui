import { cn } from "@vault/utils";
import { useEffect, useMemo, useRef, useState } from "react";

export interface UseStreamingTextOptions {
  /** milliseconds per token. */
  speed?: number;
  /** when false, the full text is shown instantly. */
  streaming?: boolean;
  onComplete?: () => void;
}

/**
 * Reveals `text` token-by-token (whitespace-aware) while `streaming` is true.
 * Hungry-safe: the timer reacts to text/streaming changes and cleans up.
 */
export function useStreamingText(
  text: string,
  { speed = 25, streaming = true, onComplete }: UseStreamingTextOptions = {},
): { visible: string; done: boolean } {
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const [count, setCount] = useState<number>(streaming ? 0 : tokens.length);
  const doneRef = useRef(false);

  // Reset when text or streaming mode changes
  useEffect(() => {
    setCount(streaming ? 0 : tokens.length);
    doneRef.current = false;
  }, [tokens, streaming]);

  // Advance the reveal
  useEffect(() => {
    if (!streaming) return;
    if (count >= tokens.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
      return;
    }
    const id = window.setTimeout(() => setCount((c) => Math.min(c + 1, tokens.length)), speed);
    return () => window.clearTimeout(id);
  }, [count, tokens.length, streaming, speed, onComplete]);

  const done = !streaming || count >= tokens.length;
  const visible = tokens.slice(0, done ? tokens.length : count).join("");

  return { visible, done };
}

export interface TokenStreamerProps {
  text: string;
  /** milliseconds per token. */
  speed?: number;
  /** when false, the full text is shown instantly. */
  streaming?: boolean;
  onComplete?: () => void;
  className?: string;
}

/**
 * Streaming text reveal with a blinking caret — the "LLM is typing"
 * effect. Rendering raw text while streaming (markdown is applied only
 * once the stream completes) keeps the caret and pacing predictable.
 */
export function TokenStreamer({
  text,
  speed = 25,
  streaming = true,
  onComplete,
  className,
}: TokenStreamerProps) {
  const { visible, done } = useStreamingText(text, { speed, streaming, onComplete });

  return (
    <span className={cn("whitespace-pre-wrap break-words", className)}>
      {visible}
      {!done && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] rounded-full bg-brand-600 animate-caret"
        />
      )}
    </span>
  );
}