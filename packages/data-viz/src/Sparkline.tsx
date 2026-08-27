import { cn } from "@gudipudimani/utils";
import { useId } from "react";

export interface SparklineProps {
  /** Numeric series — auto-scaled to the viewbox. */
  data: number[];
  /** Color of the line (token class, e.g. "text-brand-600"). */
  colorClass?: string;
  /** Fill the area under the line with a gradient. */
  fill?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * Sparkline — dependency-free SVG trend line with a soft gradient fill.
 * Stays crisp at any width via a fixed aspect ratio (no stretching).
 */
export function Sparkline({
  data,
  colorClass = "text-brand-600",
  fill = true,
  strokeWidth = 2,
  className,
}: SparklineProps) {
  const id = useId();

  if (data.length === 0) {
    return <div role="img" aria-label="No data" className={cn("w-full", className)} />;
  }

  const W = 100;
  const H = 32;
  const PAD = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return [x, y] as const;
  });

  const line = points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const area = `${first[0].toFixed(2)},${H} ${line} ${last[0].toFixed(2)},${H}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Trend"
      className={cn("w-full aspect-[100/32]", colorClass, className)}
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill={`url(#${id})`} />
        </>
      )}
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r="1.6" fill="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}