import { cn } from "@gudipudimani/utils";

export interface TreeMapItem {
  id: string;
  label: string;
  value: number;
}

export interface TreeMapProps {
  items: TreeMapItem[];
  /** Total height of the map. */
  heightClass?: string;
  className?: string;
}

const COLOR_CYCLE = [
  "bg-brand-600 text-white",
  "bg-brand-500 text-white",
  "bg-brand-400 text-surface-0",
  "bg-brand-300 text-surface-950",
  "bg-brand-200 text-surface-950",
  "bg-brand-100 text-surface-950",
];

interface Rect {
  item: TreeMapItem;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Slice-and-dice treemap — splits long-side-first, value-proportional. */
function computeRects(items: TreeMapItem[], W: number, H: number): Rect[] {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, i) => s + i.value, 0);
  if (total === 0) return [];

  const out: Rect[] = [];
  const queue: { idx: number; x: number; y: number; w: number; h: number; remaining: number }[] = [
    { idx: 0, x: 0, y: 0, w: W, h: H, remaining: total },
  ];

  while (queue.length > 0) {
    const cell = queue.shift()!;
    const item = sorted[cell.idx];
    if (!item) continue;

    const areaShare = cell.remaining === 0 ? 1 : item.value / cell.remaining;
    if (cell.w >= cell.h) {
      const w = cell.w * areaShare;
      out.push({ item, x: cell.x, y: cell.y, w, h: cell.h });
      const rest = cell.w - w;
      if (rest > 1 && cell.idx + 1 < sorted.length) {
        queue.push({ idx: cell.idx + 1, x: cell.x + w, y: cell.y, w: rest, h: cell.h, remaining: cell.remaining - item.value });
      }
    } else {
      const h = cell.h * areaShare;
      out.push({ item, x: cell.x, y: cell.y, w: cell.w, h });
      const rest = cell.h - h;
      if (rest > 1 && cell.idx + 1 < sorted.length) {
        queue.push({ idx: cell.idx + 1, x: cell.x, y: cell.y + h, w: cell.w, h: rest, remaining: cell.remaining - item.value });
      }
    }
  }
  return out;
}

/**
 * TreeMap — value-proportional nested rectangles, no chart lib.
 * Slices along the longer edge, so cells stay reasonably square.
 */
export function TreeMap({ items, heightClass = "h-[320px]", className }: TreeMapProps) {
  const rects = computeRects(items, 100, 100);
  const maxValue = Math.max(1, ...items.map((i) => i.value));

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-xl border border-surface-200", heightClass, className)}
      role="img"
      aria-label="Treemap"
    >
      {rects.map((r, i) => (
        <div
          key={r.item.id}
          className={cn(
            "absolute flex flex-col justify-between overflow-hidden p-1.5 sm:p-2",
            COLOR_CYCLE[i % COLOR_CYCLE.length],
          )}
          style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
          title={`${r.item.label}: ${r.item.value}`}
        >
          <span className="truncate text-[13px] font-semibold leading-tight">{r.item.label}</span>
          {(r.w > 12 || r.h > 12) && (
            <span className="truncate text-xs opacity-70">
              {Math.round((r.item.value / maxValue) * 100)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}