import { cn } from "@vault/utils";

export interface HeatmapCalendarProps {
  /** Cell values 0–`max`. Column-major (weeks → days), like GitHub. */
  values: number[];
  /** Highest cell value (default 4). */
  max?: number;
  /** Weeks to render (default 10 = 70 cells). */
  weeks?: number;
  /** Number of week columns shown per "month" label — 0 disables labels. */
  monthEvery?: number;
  className?: string;
}

const LEVEL_CLASSES = [
  "bg-surface-100",
  "bg-brand-200",
  "bg-brand-400",
  "bg-brand-600",
  "bg-brand-800",
];

/**
 * HeatmapCalendar — GitHub-style activity heatmap, token-driven,
 * reflows to any width (cells are square via aspect-ratio).
 */
export function HeatmapCalendar({
  values,
  max = 4,
  weeks = 10,
  monthEvery = weeks,
  className,
}: HeatmapCalendarProps) {
  const cells = weeks * 7;

  const levelFor = (i: number) => {
    const v = values[i] ?? 0;
    if (v <= 0) return 0;
    const idx = Math.min(max, Math.max(1, Math.ceil((v / max) * max)));
    return Math.min(LEVEL_CLASSES.length - 1, idx);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {monthEvery > 0 && (
        <div className="flex gap-1 text-xs font-medium text-surface-400">
          {Array.from({ length: Math.ceil(weeks / monthEvery) }).map((_, m) => (
            <span key={m} style={{ width: `${monthEvery * (100 / weeks)}%` }}>
              {"JanFebMarAprMayJunJulAugSepOctNovDec".slice(m * 3, m * 3 + 3)}
            </span>
          ))}
        </div>
      )}

      <div className="grid w-full grid-flow-col grid-rows-7 gap-1">
        {Array.from({ length: cells }).map((_, i) => (
          <span
            key={i}
            className={cn("aspect-square w-full rounded-[4px] sm:rounded", LEVEL_CLASSES[levelFor(i)])}
            title={`${values[i] ?? 0} activity`}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-1 text-xs text-surface-400">
        Less
        {LEVEL_CLASSES.map((c) => (
          <span key={c} className={cn("size-3 rounded-[3px]", c)} />
        ))}
        More
      </div>
    </div>
  );
}