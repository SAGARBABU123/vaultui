import { Badge, Card } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { AnimatedCounter } from "./AnimatedCounter";
import { Sparkline } from "./Sparkline";

export interface KpiCardProps {
  label: string;
  value: number;
  /** Percent change, e.g. 12.4 or -3.2. */
  delta?: number;
  /** Sparkline series. */
  trend?: number[];
  /** Formatter for the big value. */
  format?: (n: number) => string;
  /** Hint shown under the value, e.g. "vs last month". */
  hint?: string;
  className?: string;
}

/**
 * KpiCard — label, animated value, delta badge and sparkline in one
 * token-driven surface. Tone follows the sign of `delta`.
 */
export function KpiCard({
  label,
  value,
  delta,
  trend,
  format,
  hint,
  className,
}: KpiCardProps) {
  const up = (delta ?? 0) >= 0;
  const lineColor = delta === undefined ? "text-brand-600" : up ? "text-success-500" : "text-danger-500";
  const badgeVariant = delta === undefined ? "info" : up ? "success" : "danger";

  return (
    <Card padding="md" hover className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-surface-500">{label}</span>
        {delta !== undefined && (
          <Badge variant={badgeVariant} size="sm">
            {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
          </Badge>
        )}
      </div>

      <div className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        <AnimatedCounter value={value} format={format} />
      </div>

      {hint && <p className="mt-0.5 text-xs text-surface-400">{hint}</p>}

      {trend && trend.length > 0 && (
        <div className="mt-3 flex-1">
          <Sparkline data={trend} colorClass={lineColor} className="h-full min-h-8" />
        </div>
      )}
    </Card>
  );
}