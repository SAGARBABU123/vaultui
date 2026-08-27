import { cn } from "@gudipudimani/utils";
import { useEffect, useRef, useState, type TextareaHTMLAttributes } from "react";

export interface ChatInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  /** Called with the trimmed text when the user sends. */
  onSend: (text: string) => void;
  /** Disable sending (e.g. while streaming a response). */
  disabled?: boolean;
  /** Quick-fill suggestion chips shown above the textarea. */
  suggestions?: string[];
  /** Cap on characters (default 4000). */
  maxLength?: number;
  /** Show a rough token estimate (chars / 4) in the footer. */
  showTokenCount?: boolean;
  className?: string;
}

/**
 * PromptInput for ChatCanvas — auto-resizing textarea with
 * Enter-to-send (Shift+Enter = newline), IME-safe, token estimate
 * and suggestion chips. Responsive-first: the footer hint hides
 * on phones, and the box grows to full width on small screens.
 */
export function ChatInput({
  onSend,
  disabled = false,
  suggestions,
  maxLength = 4000,
  showTokenCount = true,
  className,
  placeholder = "Ask anything…",
  ...props
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea up to 132px
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !disabled && value.length <= maxLength;

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
    props.onKeyDown?.(e);
  };

  return (
    <div className={cn("rounded-2xl border border-surface-200 bg-surface-0 p-2 shadow-soft transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 sm:p-3", className)}>
      {suggestions && suggestions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={disabled}
              onClick={() => setValue(s)}
              className="rounded-full border-0 bg-surface-100 shadow-inset px-2.5 py-1 text-xs text-surface-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <textarea
        ref={areaRef}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        aria-label="Message"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        className="block max-h-[132px] w-full resize-none bg-transparent px-1.5 py-1.5 text-sm leading-relaxed text-surface-800 outline-none placeholder:text-surface-400 disabled:opacity-60"
        {...props}
      />

      <div className="mt-1 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-3 text-xs text-surface-400">
          {showTokenCount && (
            <span aria-label={`about ${Math.ceil(value.length / 4)} tokens`}>
              ≈{Math.ceil(value.length / 4)} tok
            </span>
          )}
          <span className="hidden sm:inline">
            Enter to send · Shift+Enter for newline
          </span>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-lg transition-colors",
            canSend
              ? "bg-brand-600 text-white shadow-soft hover:bg-brand-500"
              : "bg-surface-100 text-surface-400",
          )}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 -translate-x-px" aria-hidden="true">
      <path d="M3.105 2.288a.75.75 0 00-.826.95l1.414 4.926A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.288z" />
    </svg>
  );
}