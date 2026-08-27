import { cn } from "@vaultui/utils";

export interface RadarAxis {
  label: string;
  /** 0–100. */
  value: number;
}

export interface RadarChartProps {
  axes: RadarAxis[];
  /** Color for the data polygon. */
  colorClass?: string;
  className?: string;
}

const CX = 100;
const CY = 105;
const R = 78;
const RINGS = 4;

/**
 * RadarChart — N-axis spider chart with concentric grid rings,
 * pure SVG and token-colored.
 */
export function RadarChart({ axes, colorClass = "text-brand-600", className }: RadarChartProps) {
  const n = axes.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, value: number) => {
    const r = (value / 100) * R;
    return [CX + r * Math.cos(angle(i)), CY + r * Math.sin(angle(i))] as const;
  };

  const ringPath = (f: number) =>
    Array.from({ length: n }, (_, i) => pt(i, 100 * f).join(","))
      .map((p, i) => `${i === 0 ? "M" : "L"}${p}`)
      .join(" ") + "Z";

  const dataPath = axes.map((a, i) => pt(i, a.value).join(",")).join(" ");

  return (
    <svg viewBox="0 0 200 200" className={cn("w-full max-w-56", colorClass, className)} role="img" aria-label="Radar chart">
      {Array.from({ length: RINGS }, (_, i) => (
        <path
          key={i}
          d={ringPath((i + 1) / RINGS)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={i === RINGS - 1 ? 0.2 : 0.12}
        />
      ))}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 100);
        return (
          <g key={a.label}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.12" />
            <text
              x={CX + (R + 16) * Math.cos(angle(i))}
              y={CY + (R + 16) * Math.sin(angle(i)) + 3}
              textAnchor="middle"
              fontSize="8"
              fill="currentColor"
              fillOpacity="0.6"
            >
              {a.label}
            </text>
          </g>
        );
      })}
      <polygon points={dataPath} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.value);
        return <circle key={i} cx={x} cy={y} r="1.8" fill="currentColor" />;
      })}
    </svg>
  );
}