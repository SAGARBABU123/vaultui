import { cn } from "@vaultui/utils";

/* ============================== ScatterChart ============================== */

export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface ScatterChartProps {
  points: ScatterPoint[];
  /** Axis domain [minX, maxX, minY, maxY] — defaults to data range. */
  bounds?: [number, number, number, number];
  height?: number;
  className?: string;
}

export function ScatterChart({ points, bounds, height = 180, className }: ScatterChartProps) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const [minX, maxX, minY, maxY] = bounds ?? [
    Math.min(0, ...xs),
    Math.max(1, ...xs),
    Math.min(0, ...ys),
    Math.max(1, ...ys),
  ];
  const W = 400;
  const px = (x: number) => 20 + ((x - minX) / (maxX - minX)) * (W - 40);
  const py = (y: number) => 12 + (1 - (y - minY) / (maxY - minY)) * (height - 24);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} style={{ width: "100%", minWidth: 260, height: "auto" }} className={cn("overflow-visible", className)} role="img" aria-label="Scatter chart">
      <line x1={20} x2={W - 20} y1={height - 12} y2={height - 12} stroke="var(--color-surface-200)" strokeWidth="1" />
      <line x1={20} x2={20} y1={12} y2={height - 12} stroke="var(--color-surface-200)" strokeWidth="1" />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={px(p.x)}
          cy={py(p.y)}
          r="4.5"
          fill={p.color ?? "var(--color-brand-600)"}
          stroke="var(--color-surface-0)"
          strokeWidth="1.5"
          className="vault-chart-dot"
        >
          <title>{`${p.label ?? "point"}: (${p.x}, ${p.y})`}</title>
        </circle>
      ))}
    </svg>
  );
}

/* =============================== FunnelChart ============================== */

export interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  /** Show conversion % between stages. Default true. */
  showConversion?: boolean;
  className?: string;
}

export function FunnelChart({ stages, showConversion = true, className }: FunnelChartProps) {
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div className={cn("flex flex-col items-center gap-1", className)} role="img" aria-label="Funnel chart">
      {stages.map((s, i) => {
        const width = Math.max(18, Math.round((s.value / max) * 100));
        const prev = i > 0 ? stages[i - 1]!.value : null;
        return (
          <div key={i} className="flex w-full flex-col items-center gap-0.5">
            <div
              className="flex h-9 items-center justify-center rounded-lg font-semibold text-white"
              style={{ width: `${width}%`, background: s.color ?? "var(--color-brand-600)" }}
            >
              {s.value}
            </div>
            <span className="font-mono text-[10px] text-surface-400">{s.label}</span>
            {showConversion && prev !== null && (
              <span className="font-mono text-[9px] text-success-500">{Math.round((s.value / prev) * 100)}%</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================================ GaugeChart ============================== */

export interface GaugeChartProps {
  value: number;
  /** 0–100 range. */
  min?: number;
  max?: number;
  label?: string;
  size?: number;
  className?: string;
}

export function GaugeChart({ value, min = 0, max = 100, label, size = 170, className }: GaugeChartProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const frac = (clamped - min) / Math.max(1, max - min);
  const r = (size - 18) / 2;
  const arc = Math.PI * r; // half-circle length
  const stroke = Math.PI * r * 0.85; // ~85% sweep

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size / 2 + 14 }}>
      <svg width={size} height={size / 2 + 14} viewBox={`0 0 ${size} ${size / 2 + 14}`} role="img" aria-label="Gauge chart">
        <path
          d={`M ${18 + r - arc / 2} ${r + 18} A ${r} ${r} 0 0 1 ${18 + r + arc / 2} ${r + 18}`}
          fill="none"
          stroke="var(--color-surface-100)"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d={`M ${18 + r - arc / 2} ${r + 18} A ${r} ${r} 0 0 1 ${18 + r + arc / 2} ${r + 18}`}
          fill="none"
          stroke="var(--color-brand-600)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`${frac * stroke} ${stroke}`}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="vault-chart-center" style={{ fontSize: Math.round(22 * (size / 170)) }}>
          {clamped}
        </div>
        {label && <div className="vault-chart-center-sub">{label}</div>}
      </div>
    </div>
  );
}

/* =============================== BulletChart ============================== */

export interface BulletChartProps {
  value: number;
  target: number;
  max: number;
  /** Optional label for the measure. */
  label?: string;
  q1?: number;
  q2?: number;
  className?: string;
}

/** Bullet graph — quantile band, measure bar and target marker. */
export function BulletChart({ value, target, max, label, q1 = 0.6 * max, q2 = 0.8 * max, className }: BulletChartProps) {
  const pct = (n: number) => `${Math.max(0, Math.min(100, (n / Math.max(1, max)) * 100))}%`;
  return (
    <div className={cn("space-y-1", className)} role="img" aria-label={`Bullet chart: ${value} of ${max}, target ${target}`}>
      {label && <div className="font-mono text-[10px] text-surface-400">{label}</div>}
      <div className="relative h-3.5 rounded-full bg-surface-100 shadow-inset">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: pct(q1), background: "var(--color-surface-200)" }} />
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: pct(q2), background: "var(--color-surface-300)" }} />
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: pct(value), background: "var(--color-brand-600)" }} />
        <div className="absolute -top-0.5 bottom-0.5 w-1 rounded-full bg-surface-900" style={{ left: pct(target) }} title={`target ${target}`} />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-surface-400">
        <span>{value}</span>
        <span>target {target}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}