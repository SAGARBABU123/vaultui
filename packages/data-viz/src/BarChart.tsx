import { cn } from "@vaultui/utils";

export interface BarDatum {
  label: string;
  value: number;
  /** Any CSS color — defaults to the theme brand. */
  color?: string;
}

export interface BarChartProps {
  data: BarDatum[];
  /** Container height in px. Default 170. */
  height?: number;
  /** Show value labels above bars. Default true. */
  showValues?: boolean;
  className?: string;
}

/**
 * Zero-dependency bar chart — pure flex bars, token-driven fill
 * (defaults to var(--color-brand-600)). Negative-safe: values are
 * scaled from the max |value|.
 */
export function BarChart({ data, height = 170, showValues = true, className }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => Math.abs(d.value)));
  // Labels/bars scale with the chart height so small charts stay readable.
  const f = Math.min(2, Math.max(0.6, height / 140));
  const valueFont = Math.round(10 * f);
  const labelFont = Math.round(9 * f);
  const barMax = Math.round(34 * f);

  return (
    <div className={cn("flex items-end gap-3", className)} style={{ height }} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const h = `${Math.round((Math.abs(d.value) / max) * 88 + 8)}%`;
        return (
          <div key={`${d.label}-${i}`} className="group flex min-w-0 flex-1 flex-col items-center gap-1.5">
            {showValues && (
              <span className="vault-chart-value" style={{ fontSize: valueFont }}>
                {d.value}
              </span>
            )}
            <div
              className="vault-chart-bar"
              style={{
                height: h,
                width: "100%",
                maxWidth: barMax,
                minWidth: Math.max(10, Math.round(14 * f)),
                background: d.color ?? "var(--color-brand-600)",
              }}
              title={`${d.label}: ${d.value}`}
            />
            <span className="vault-chart-label" style={{ fontSize: labelFont }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}