import { cn } from "@vaultui/utils";
import type { CSSProperties } from "react";

export interface DonutSlice {
  label: string;
  value: number;
  /** Any CSS color — defaults resolved from the theme palette. */
  color?: string;
}

export interface DonutChartProps {
  data: DonutSlice[];
  /** Diameter in px. Default 168. */
  size?: number;
  /** Ring thickness in px. Default 24. */
  thickness?: number;
  /** Text in the donut center (e.g. a total). */
  centerLabel?: string;
  centerValue?: string;
  /** Show the legend underneath. Default true. */
  legend?: boolean;
  className?: string;
}

const PALETTE = [
  "var(--color-brand-600)",
  "var(--color-info-500)",
  "var(--color-success-500)",
  "var(--color-warning-500)",
  "var(--color-danger-500)",
  "var(--color-surface-400)",
  "var(--color-brand-300)",
];

/**
 * Zero-dependency donut chart — SVG stroke-dasharray slices with a hover
 * expand, optional center metric and a color-coded legend.
 */
export function DonutChart({
  data,
  size = 168,
  thickness = 24,
  centerLabel,
  centerValue,
  legend = true,
  className,
}: DonutChartProps) {
  const total = Math.max(1, data.reduce((n, d) => n + Math.max(0, d.value), 0));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-surface-100)"
            strokeWidth={thickness}
          />
          {data.map((d, i) => {
            const frac = Math.max(0, d.value) / total;
            const dash = frac * c;
            const color = d.color ?? PALETTE[i % PALETTE.length]!;
            const el = (
              <circle
                key={`${d.label}-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeDasharray={`${dash - 3} ${c - dash + 3}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="vault-chart-slice"
              >
                <title>{`${d.label}: ${d.value} (${Math.round(frac * 100)}%)`}</title>
              </circle>
            );
            offset += dash;
            return el;
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <span className="vault-chart-center" style={{ fontSize: 20 }}>
                {centerValue}
              </span>
            )}
            {centerLabel && <span className="vault-chart-center-sub">{centerLabel}</span>}
          </div>
        )}
      </div>

      {legend && (
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          {data.map((d, i) => (
            <li key={`${d.label}-${i}`} className="flex items-center gap-1.5">
              <span className="vault-chart-swatch" style={{ background: d.color ?? PALETTE[i % PALETTE.length] }} />
              <span className="vault-chart-label">
                {d.label} · {d.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}