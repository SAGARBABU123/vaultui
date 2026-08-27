import { cn } from "@vault/utils";

export interface GanttTask {
  id: string;
  name: string;
  /** 0-based week index. */
  start: number;
  /** Exclusive end week index. */
  end: number;
  /** Completion 0–100. */
  progress?: number;
  group?: string;
}

export interface GanttChartProps {
  tasks: GanttTask[];
  /** Total weeks rendered (axis length). */
  weeks?: number;
  className?: string;
}

const groupColors: Record<string, string> = {
  "Planned": "bg-surface-300",
  "Build": "bg-brand-500",
  "QA": "bg-info-500",
  "Done": "bg-success-500",
};

/**
 * GanttChart — dependency-free week-axis Gantt with progress fills
 * and group coloring. Scrolls horizontally on small screens.
 */
export function GanttChart({ tasks, weeks = 16, className }: GanttChartProps) {
  const axis = Array.from({ length: weeks }, (_, i) => (i % 4 === 0 ? `W${i + 1}` : ""));

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-surface-200 bg-surface-0 shadow-soft", className)}>
      <div className="min-w-[720px]">
        {/* Axis */}
        <div
          className="grid grid-cols-[180px_repeat(16,minmax(0,1fr))] border-b border-surface-200 bg-surface-50 text-[10px] font-medium text-surface-400"
          style={{ gridTemplateColumns: `180px repeat(${weeks}, minmax(0,1fr))` }}
        >
          <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide">Task</div>
          {axis.map((label, i) => (
            <div key={i} className="border-l border-surface-100 px-1 py-2 text-center">
              {label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {tasks.map((task) => {
          const barColor = groupColors[task.group ?? "Build"] ?? "bg-brand-500";
          const startPct = (task.start / weeks) * 100;
          const widthPct = (Math.max(1, task.end - task.start) / weeks) * 100;
          return (
            <div
              key={task.id}
              className="grid border-b border-surface-100 last:border-b-0"
              style={{ gridTemplateColumns: `180px repeat(${weeks}, minmax(0,1fr))`, gridTemplateRows: "auto" }}
            >
              <div className="truncate px-4 py-2.5 text-[12px] font-medium text-surface-700">{task.name}</div>
              <div className="relative col-span-16 h-8">
                {axis.map((_, i) => (
                  <div key={i} className="absolute inset-y-0 w-[6.25%] border-l border-surface-50 first:border-l-0" style={{ left: `${i * 6.25}%` }} />
                ))}
                <div
                  className={cn("absolute top-1/2 z-10 flex h-3.5 -translate-y-1/2 items-center overflow-hidden rounded-full shadow-soft", barColor)}
                  style={{ left: `${startPct}%`, width: `${Math.min(widthPct, 100 - startPct)}%` }}
                >
                  <span
                    className="h-full bg-black/20"
                    style={{ width: `${Math.min(100, task.progress ?? 0)}%` }}
                  />
                </div>
                {task.end <= weeks && (
                  <span
                    className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-[9px] text-surface-400"
                    style={{ left: `${startPct + widthPct}%` }}
                  >
                    ◈
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}