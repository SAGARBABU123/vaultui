import { cn } from "@gudipudimani/utils";

export interface WaterfallStep {
  label: string;
  value: number;
  /** totals anchor at zero; deltas float on the running total. */
  type?: "delta" | "total";
}

export interface WaterfallChartProps {
  steps: WaterfallStep[];
  format?: (n: number) => string;
  className?: string;
}

const W = 320;
const H = 180;
const PAD = { top: 16, right: 16, bottom: 28, left: 12 };

interface Placed {
  step: WaterfallStep;
  start: number;
  end: number;
}

/**
 * WaterfallChart — cumulatives rendered from a running baseline,
 * with connector lines and total bars anchored to zero.
 */
export function WaterfallChart({ steps, format = (n) => String(Math.round(n)), className }: WaterfallChartProps) {
  const placed: Placed[] = [];
  let running = 0;
  for (const step of steps) {
    if (step.type === "total") {
      placed.push({ step, start: 0, end: step.value });
      running = step.value;
    } else {
      placed.push({ step, start: running, end: running + step.value });
      running += step.value;
    }
  }

  const values = placed.flatMap((p) => [p.start, p.end]);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const range = max - min || 1;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const y = (v: number) => PAD.top + ((max - v) / range) * plotH;

  const slot = plotW / steps.length;
  const barW = Math.min(34, slot * 0.55);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("w-full aspect-[16/9]", className)}
      role="img"
      aria-label="Waterfall chart"
    >
      {/* gridlines */}
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + plotH * f} y2={PAD.top + plotH * f} stroke="currentColor" strokeOpacity="0.08" />
        </g>
      ))}

      {placed.map((p, i) => {
        const cx = PAD.left + slot * i + slot / 2;
        const up = p.end >= p.start;
        const color =
          p.step.type === "total" ? "fill-surface-300" : up ? "fill-brand-600" : "fill-danger-500";
        const x = cx - barW / 2;
        const h = Math.max(2, Math.abs(y(p.start) - y(p.end)));
        const top = y(Math.max(p.start, p.end));

        return (
          <g key={i}>
            {/* connector */}
            {i > 0 &&
              (placed[i - 1]!.step.type === "delta" ? (
                <line
                  x1={cx - barW / 2}
                  x2={cx - barW / 2}
                  y1={y(placed[i - 1]!.end)}
                  y2={y(p.start)}
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeDasharray="3 3"
                />
              ) : null)}
            <rect x={x} y={top} width={barW} height={h} rx={3} className={color} />
            {/* value label */}
            {h > 16 && (
              <text
                x={cx}
                y={up ? top + 12 : top - 6}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                fillOpacity="0.6"
              >
                {format(p.end)}
              </text>
            )}
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.5" className="truncate">
              {p.step.label.slice(0, 12)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}