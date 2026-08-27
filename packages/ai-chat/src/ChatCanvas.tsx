import { Badge } from "@vault/ui";
import { cn } from "@vault/utils";
import { useEffect, useRef, type ReactNode } from "react";
import { Markdown } from "./Markdown";
import { SourceCitation } from "./SourceCitation";
import { TokenStreamer } from "./TokenStreamer";
import { ToolCallInspector } from "./ToolCallInspector";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage, SourceCitationItem } from "./types";

export interface ChatCanvasProps {
  messages: ChatMessage[];
  /** Show the "thinking" indicator pinned at the bottom (e.g. while waiting for the first token). */
  isTyping?: boolean;
  /** tokens/sec for streaming messages. */
  speed?: number;
  /** Called when a source citation chip is clicked. */
  onCitationClick?: (citation: SourceCitationItem) => void;
  /** Rendered when there are no messages. */
  emptyState?: ReactNode;
  /** Height of the scrollable viewport. */
  heightClass?: string;
  className?: string;
}

/**
 * ChatCanvas — the AI Agent Kit flagship.
 *
 * Renders user / assistant / system messages with:
 *  - token-by-token streaming for assistant messages (`streaming: true`)
 *  - collapsible ToolCallInspectors
 *  - RAG SourceCitation chips
 *  - auto-scroll to the newest message
 *
 * Responsive-first: bubbles cap at 85% width on phones, tool calls
 * collapse by default on small screens, and the viewport is
 * `h-[…] sm:h-[…]` swappable via `heightClass`.
 */
export function ChatCanvas({
  messages,
  isTyping = false,
  speed = 15,
  onCitationClick,
  emptyState,
  heightClass = "h-[420px] sm:h-[520px]",
  className,
}: ChatCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest content
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-surface-200 bg-surface-50 shadow-soft",
        className,
      )}
    >
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className={cn("flex flex-col gap-4 overflow-y-auto p-4 sm:p-5", heightClass)}
      >
        {messages.length === 0 && emptyState !== undefined ? (
          emptyState
        ) : (
          messages.map((m) => <Message key={m.id} message={m} onCitationClick={onCitationClick} speed={speed} />)
        )}

        {isTyping && (
          <div className="flex items-end gap-2 self-start animate-rise">
            <Avatar />
            <div className="rounded-2xl rounded-bl-md border border-surface-200 bg-surface-0 px-4 py-3 shadow-soft">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- message -------------------------------- */

function Message({
  message,
  speed,
  onCitationClick,
}: {
  message: ChatMessage;
  speed: number;
  onCitationClick?: (c: SourceCitationItem) => void;
}) {
  const { role } = message;

  if (role === "system") {
    return (
      <div className="self-center rounded-full bg-surface-200/70 px-3.5 py-1.5 text-xs text-surface-500">
        {message.content}
      </div>
    );
  }

  const isUser = role === "user";
  const hasTools = !!message.toolCalls?.length;
  const hasSources = !!message.sources?.length;

  return (
    <div
      className={cn(
        "flex w-full gap-2.5 animate-rise",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && <Avatar error={message.error} />}

      <div
        className={cn(
          "flex min-w-0 max-w-[88%] flex-col gap-2 sm:max-w-[78%]",
          isUser && "items-end",
        )}
      >
        {/* Tool calls render above the assistant bubble, collapsed by default */}
        {!isUser &&
          message.toolCalls?.map((call) => (
            <ToolCallInspector key={call.id ?? call.name} {...call} className="w-full" />
          ))}

        {message.content && !isUser && (
          <div
            className={cn(
              "rounded-2xl rounded-tl-md border px-4 py-3 shadow-soft",
              message.error
                ? "border-danger-200 bg-danger-500/5 text-danger-600"
                : "border-surface-200 bg-surface-0 text-surface-800",
            )}
          >
            {message.streaming ? (
              <TokenStreamer text={message.content} speed={speed} streaming />
            ) : (
              <Markdown>{message.content}</Markdown>
            )}
          </div>
        )}

        {isUser && message.content && (
          <div className="max-w-[88%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-soft sm:max-w-[75%]">
            {message.content}
          </div>
        )}

        {!isUser && hasSources && (
          <div className="flex flex-wrap gap-1.5">
            {message.sources!.map((citation) => (
              <SourceCitation
                key={citation.id}
                citation={citation}
                onClick={() => onCitationClick?.(citation)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ error = false }: { error?: boolean }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-bold text-white shadow-soft",
        error ? "bg-danger-500" : "bg-gradient-to-br from-brand-500 to-brand-700",
      )}
      aria-hidden="true"
    >
      AI
    </div>
  );
}

/* ------------------------------ Status badge ------------------------------ */

export function ChatStatusBadge({
  status,
}: {
  status: "streaming" | "complete" | "error";
}) {
  const meta =
    status === "streaming"
      ? { label: "Streaming", variant: "info" as const, dot: true }
      : status === "error"
        ? { label: "Error", variant: "danger" as const, dot: true }
        : { label: "Complete", variant: "success" as const, dot: false };
  return <Badge variant={meta.variant} dot={meta.dot}>{meta.label}</Badge>;
}