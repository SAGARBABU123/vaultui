import { cn } from "@vaultui/utils";
import { useId } from "react";

export interface LineSeries {
  label: string;
  points: number[];
  /** Any CSS color — defaults to the theme brand. */
  color?: string;
}

export interface LineChartProps {
  series: LineSeries[];
  /** X-axis labels; falls back to index+1. */
  labels?: string[];
  /** SVG height in px. Default 180. */
  height?: number;
  /** Show area fill under the line. Default true. */
  area?: boolean;
  className?: string;
}

const W = 400;
const PAD_X = 8;
const PAD_TOP = 10;
const PAD_BOTTOM = 8;

/**
 * Zero-dependency line chart (smooth SVG path + optional gradient area).
 * Geometry is inline; stroke/fill default to theme token CSS variables.
 */
export function LineChart({ series, labels, height = 180, area = true, className }: LineChartProps) {
  const uid = useId().replace(/[:]/g, "");
  const all = series.flatMap((s) => s.points);
  const min = Math.min(0, ...all);
  const max = Math.max(1, ...all);
  const H = height;
  const plotH = H - PAD_TOP - PAD_BOTTOM;

  const x = (i: number, len: number) => PAD_X + (i / Math.max(1, len - 1)) * (W - PAD_X * 2);
  const y = (v: number) => PAD_TOP + (1 - (v - min) / (max - min)) * plotH;

  // Smooth path (catmull-rom → cubic bézier).
  const smooth = (pts: number[]) =>
    pts
      .map((v, i) => {
        const px = x(i, pts.length);
        const py = y(v);
        if (i === 0) return `M ${px} ${py}`;
        const prev = pts[i - 1]!;
        const pxx = x(i - 1, pts.length);
        const pyy = y(prev);
        const mx = (pxx + px) / 2;
        return `C ${mx} ${pyy}, ${mx} ${py}, ${px} ${py}`;
      })
      .join(" ");

  const gridYs = [0, 0.33, 0.67, 1].map((t) => PAD_TOP + t * plotH);
  const len = Math.max(1, ...series.map((s) => s.points.length));

  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: 280, height: "auto" }}
        role="img"
        aria-label="Line chart"
      >
        {gridYs.map((gy, i) => (
          <line key={i} x1={PAD_X} x2={W - PAD_X} y1={gy} y2={gy} stroke="var(--color-surface-200)" strokeWidth="1" strokeDasharray="3 4" />
        ))}

        <defs>
          {series.map((s, i) =>
            area ? (
              <linearGradient key={i} id={`${uid}-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color ?? "var(--color-brand-600)"} stopOpacity="0.28" />
                <stop offset="100%" stopColor={s.color ?? "var(--color-brand-600)"} stopOpacity="0" />
              </linearGradient>
            ) : null,
          )}
        </defs>

        {series.map((s, i) => {
          const d = smooth(s.points);
          const col = s.color ?? (i === 0 ? "var(--color-brand-600)" : "var(--color-info-500)");
          return (
            <g key={i}>
              {area && (
                <path
                  d={`${d} L ${x(s.points.length - 1, s.points.length)} ${H - PAD_BOTTOM} L ${x(0, s.points.length)} ${H - PAD_BOTTOM} Z`}
                  fill={`url(#${uid}-grad-${i})`}
                />
              )}
              <path d={d} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {s.points.map((v, j) => (
                <circle
                  key={j}
                  cx={x(j, s.points.length)}
                  cy={y(v)}
                  r="3"
                  fill={col}
                  stroke="var(--color-surface-0)"
                  strokeWidth="1.5"
                  className="vault-chart-dot"
                >
                  <title>{`${s.label} · ${labels?.[j] ?? j + 1}: ${v}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>

      {labels && (
        <div className="vault-chart-xaxis" style={{ width: "100%", minWidth: 280 }}>
          {labels.map((l, i) => (
            <span key={i} style={{ left: `${(i / Math.max(1, len - 1)) * 100}%` }}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}