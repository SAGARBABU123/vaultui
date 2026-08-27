import { cn } from "@gudipudimani/utils";
import { useEffect, useRef, useState } from "react";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  /** Optional JSON payload, pretty-printed in the row. */
  payload?: unknown;
  timestamp: string;
}

export interface LogStreamProps {
  entries: LogEntry[];
  heightClass?: string;
  className?: string;
}

const levelMeta: Record<LogLevel, { label: string; text: string; dot: string }> = {
  debug: { label: "DEBUG", text: "text-surface-400", dot: "bg-surface-400" },
  info: { label: "INFO", text: "text-info-500", dot: "bg-info-500" },
  warn: { label: "WARN", text: "text-warning-500", dot: "bg-warning-500" },
  error: { label: "ERROR", text: "text-danger-500", dot: "bg-danger-500" },
};

/**
 * LogStream — filterable, follow-tail log viewer.
 * `follow` auto-scrolls to the newest entry unless the user scrolled up.
 * Responsive-first: level + message wrap; payload truncates on phones.
 */
export function LogStream({ entries, heightClass = "h-72 sm:h-80", className }: LogStreamProps) {
  const [filter, setFilter] = useState<LogLevel | "all">("all");
  const [follow, setFollow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);

  const shown = entries.filter((e) => filter === "all" || e.level === filter);
  const counts = {
    debug: entries.filter((e) => e.level === "debug").length,
    info: entries.filter((e) => e.level === "info").length,
    warn: entries.filter((e) => e.level === "warn").length,
    error: entries.filter((e) => e.level === "error").length,
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [shown.length, follow]);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-surface-800 bg-surface-950 shadow-soft", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-800 bg-surface-900 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1">
          {(["all", "debug", "info", "warn", "error"] as const).map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => setFilter(lv)}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-semibold transition-colors",
                filter === lv
                  ? "bg-surface-700 text-surface-100"
                  : "text-surface-400 hover:text-surface-200",
              )}
            >
              {lv === "all" ? `All ${entries.length}` : `${lv} ${counts[lv]}`}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFollow((f) => !f)}
          aria-pressed={follow}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors",
            follow ? "bg-brand-600 text-white" : "text-surface-400 hover:text-surface-200",
          )}
        >
          <span className={cn("size-1.5 rounded-full", follow ? "bg-white" : "bg-surface-600")} />
          Follow
        </button>
      </div>

      {/* Log body */}
      <div
        ref={scrollRef}
        onScroll={() => {
          const el = scrollRef.current;
          if (!el) return;
          const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
          stickRef.current = atBottom;
        }}
        role="log"
        aria-live="polite"
        className={cn("overflow-y-auto px-3 py-2 font-mono text-xs leading-5 sm:text-xs", heightClass)}
      >
        {shown.length === 0 && (
          <p className="py-6 text-center text-surface-600">No {filter} entries.</p>
        )}
        {shown.map((e) => {
          const meta = levelMeta[e.level];
          return (
            <div key={e.id} className="flex items-start gap-2 py-1">
              <span className="select-none text-surface-600">{e.timestamp}</span>
              <span className={cn("w-12 shrink-0 select-none font-bold", meta.text)}>{meta.label}</span>
              <span className="min-w-0 flex-1 text-surface-200">{e.message}</span>
              {e.payload !== undefined && (
                <span className="hidden max-w-[45%] shrink truncate text-surface-500 sm:block">
                  {JSON.stringify(e.payload)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}