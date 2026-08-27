import { cn } from "@vault/utils";

export interface GeoRegion {
  id: string;
  label: string;
  value: number;
  /** 0–100 coordinates inside the map box. */
  x: number;
  y: number;
}

export interface GeoMapProps {
  regions: GeoRegion[];
  /** Stylized continent blobs (x, y, r in viewbox units). */
  landmasses?: { x: number; y: number; rx: number; ry: number }[];
  className?: string;
}

const DEFAULT_LAND = [
  { x: 22, y: 33, rx: 13, ry: 9 },
  { x: 35, y: 28, rx: 9, ry: 7 },
  { x: 52, y: 30, rx: 16, ry: 9 },
  { x: 72, y: 30, rx: 8, ry: 6 },
  { x: 76, y: 42, rx: 6, ry: 5 },
  { x: 30, y: 68, rx: 9, ry: 11 },
  { x: 50, y: 74, rx: 15, ry: 8 },
  { x: 62, y: 55, rx: 7, ry: 8 },
];

/**
 * GeoMap — stylized dot map: continent blobs + value-scaled marker
 * dots. Zero heavy geo libraries; coordinates are 0–100 %.
 */
export function GeoMap({ regions, landmasses = DEFAULT_LAND, className }: GeoMapProps) {
  const max = Math.max(1, ...regions.map((r) => r.value));

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-xl border-0 bg-surface-100 shadow-inset",
        className,
      )}
      role="img"
      aria-label="Map"
    >
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--color-surface-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-surface-200)_1px,transparent_1px)] [background-size:12.5%_12.5%]" />

      {/* landmasses */}
      {landmasses.map((lm, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute rounded-[50%] bg-surface-200/80"
          style={{ left: `${lm.x}%`, top: `${lm.y}%`, width: `${lm.rx * 2}%`, height: `${lm.ry * 2}%`, transform: "translate(-50%,-50%)" }}
        />
      ))}

      {/* markers */}
      {regions.map((r) => {
        const size = 4 + (r.value / max) * 16;
        return (
          <div
            key={r.id}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600/85 text-white shadow-soft ring-2 ring-brand-600/20",
              r.value >= max * 0.8 && "bg-brand-700",
            )}
            style={{ left: `${r.x}%`, top: `${r.y}%`, width: size, height: size }}
            title={`${r.label} — ${r.value}`}
          >
            {size >= 14 && <span className="text-[10px] font-bold">{r.label[0]}</span>}
          </div>
        );
      })}

      {/* legend */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full border border-surface-200 bg-surface-0/90 px-2.5 py-1 text-[11px] text-surface-500 shadow-soft">
        <span className="size-2 rounded-full bg-brand-600/50" style={{ width: 6, height: 6 }} />
        Min
        <span className="mx-0.5 inline-block h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-600/40 to-brand-700" />
        1×
        <span className="mx-0.5 inline-block h-3 w-3 rounded-full bg-brand-700" />
        Max
      </div>
    </div>
  );
}