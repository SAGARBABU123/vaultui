import { cn } from "@vault/utils";

export type MemoryType = "fact" | "preference" | "event" | "task";

export interface MemoryEntry {
  id: string;
  type: MemoryType;
  title: string;
  detail?: string;
  /** 0–1 confidence in the memory. */
  confidence?: number;
  /** Human-readable age, e.g. "2h ago". */
  timestamp?: string;
}

export interface MemoryTimelineProps {
  entries: MemoryEntry[];
  /** Height of the scrollable viewport. */
  heightClass?: string;
  /** Called when a memory is selected. */
  onSelect?: (entry: MemoryEntry) => void;
  className?: string;
}

const typeMeta: Record<MemoryType, { label: string; ring: string; dot: string }> = {
  fact: { label: "Fact", ring: "border-brand-200", dot: "bg-brand-500" },
  preference: { label: "Preference", ring: "border-warning-200", dot: "bg-warning-500" },
  event: { label: "Event", ring: "border-info-200", dot: "bg-info-500" },
  task: { label: "Task", ring: "border-success-200", dot: "bg-success-500" },
};

/**
 * MemoryTimeline — "what the agent remembers", rendered as a vertical
 * timeline with per-type colors and confidence bars. Scrollable,
 * responsive-first (full width, connectors scale with padding).
 */
export function MemoryTimeline({
  entries,
  heightClass = "h-[360px]",
  onSelect,
  className,
}: MemoryTimelineProps) {
  return (
    <ol
      className={cn("space-y-0 overflow-y-auto pr-1", heightClass, className)}
      aria-label="Agent memory timeline"
    >
      {entries.map((entry, i) => {
        const meta = typeMeta[entry.type];
        const isLast = i === entries.length - 1;
        return (
          <li key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
            {/* rail */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 size-2.5 shrink-0 rounded-full ring-4",
                  meta.dot,
                  meta.ring,
                )}
              />
              {!isLast && <span className="mt-1 w-px flex-1 bg-surface-200" />}
            </div>

            {/* entry */}
            <button
              type="button"
              onClick={() => onSelect?.(entry)}
              className="group min-w-0 flex-1 rounded-xl border border-surface-200 bg-surface-0 p-3 text-left shadow-soft transition-colors hover:border-brand-300 hover:shadow-raised"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-surface-800 group-hover:text-brand-700">
                  {entry.title}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="rounded-full bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-surface-500">
                    {meta.label}
                  </span>
                  {entry.timestamp && (
                    <span className="text-[10px] text-surface-400">{entry.timestamp}</span>
                  )}
                </span>
              </div>

              {entry.detail && (
                <p className="mt-1 line-clamp-2 text-sm text-surface-500">{entry.detail}</p>
              )}

              {entry.confidence !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface-100">
                    <span
                      className={cn("block h-full rounded-full", meta.dot)}
                      style={{ width: `${Math.round(entry.confidence * 100)}%` }}
                    />
                  </span>
                  <span className="text-[10px] font-medium text-surface-400">
                    {Math.round(entry.confidence * 100)}%
                  </span>
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}