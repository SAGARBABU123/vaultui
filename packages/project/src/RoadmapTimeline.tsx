import { Badge } from "@vault/ui";
import { cn } from "@vault/utils";

export type PhaseColor = "brand" | "success" | "warning" | "danger" | "info";

export interface RoadmapItem {
  id: string;
  name: string;
  /** 0-based month index. */
  start: number;
  /** Exclusive end month index. */
  end: number;
  color?: PhaseColor;
  status?: "planned" | "in-progress" | "shipped";
  milestone?: boolean;
}

export interface RoadmapTimelineProps {
  items: RoadmapItem[];
  /** Current month index for the "now" marker (0–11). */
  now?: number;
  /** Month labels, 12 entries. */
  months?: string[];
  className?: string;
}

const DEFAULT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const colorBar: Record<PhaseColor, string> = {
  brand: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  info: "bg-info-500",
};

const statusLabel: Record<NonNullable<RoadmapItem["status"]>, { label: string; variant: "info" | "success" | "neutral" }> = {
  planned: { label: "Planned", variant: "info" },
  "in-progress": { label: "In progress", variant: "info" },
  shipped: { label: "Shipped", variant: "success" },
};

/**
 * RoadmapTimeline — quarterly-style roadmap with month grid,
 * a "now" marker and milestone diamonds. Horizontal scroll on
 * phones; bars use CSS grid columns so everything stays aligned.
 */
export function RoadmapTimeline({
  items,
  now = 7,
  months = DEFAULT_MONTHS,
  className,
}: RoadmapTimelineProps) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-surface-200 bg-surface-0 shadow-soft", className)}>
      <div className="min-w-[640px]">
        {/* Month header */}
        <div className="grid grid-cols-[160px_repeat(12,minmax(0,1fr))] border-b border-surface-200 bg-surface-50">
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-surface-400">
            Initiative
          </div>
          {months.map((m, i) => (
            <div
              key={m}
              className={cn(
                "border-l border-surface-100 px-2 py-2 text-xs font-medium",
                i === now ? "text-brand-600" : "text-surface-400",
              )}
            >
              {m}
            </div>
          ))}
        </div>

        {/* Rows */}
        {items.map((item) => {
          const bar = colorBar[item.color ?? "brand"];
          const label = item.status ? statusLabel[item.status] : null;
          return (
            <div
              key={item.id}
              className="relative grid grid-cols-[160px_repeat(12,minmax(0,1fr))] items-center border-b border-surface-100 last:border-b-0"
              style={{ gridTemplateRows: "auto" }}
            >
              <div className="flex min-w-0 items-center gap-2 px-4 py-3">
                <span className="truncate text-[13px] font-medium text-surface-800">{item.name}</span>
                {label && <Badge variant={label.variant} size="sm" className="hidden lg:inline-flex">{label.label}</Badge>}
              </div>

              <div className="relative col-span-12 flex h-12 items-center">
                {/* Month column guides */}
                {months.map((_, i) => (
                  <div key={i} className="absolute inset-y-0 w-[8.3333%] border-l border-surface-100 first:border-l-0" style={{ left: `${i * 8.3333}%` }} />
                ))}
                {/* now marker */}
                <div className="absolute inset-y-0 w-px bg-brand-500" style={{ left: `${now * 8.3333}%` }}>
                  <span className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-brand-500" />
                </div>
                {/* bar */}
                <div
                  className={cn("relative z-10 h-6 rounded-full opacity-90 shadow-soft", bar)}
                  style={{ gridColumn: undefined, left: `${item.start * 8.3333}%`, width: `${Math.max(1.5, (item.end - item.start) * 8.3333)}%` }}
                >
                  {item.milestone && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs" aria-hidden="true">
                      ◆
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}