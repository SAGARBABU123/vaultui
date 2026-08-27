import { cn } from "@vaultui/utils";
import { useEffect, useState } from "react";

export type RadialTone = "brand" | "success" | "warning" | "danger";

export interface ProgressRadialProps {
  /** 0–100. */
  value: number;
  /** Pixel size of the gauge. */
  size?: number;
  /** Stroke width in px. */
  stroke?: number;
  tone?: RadialTone;
  /** Label in the center (usually a number or short text). */
  label?: string;
  /** Small text under the center label. */
  sublabel?: string;
  className?: string;
}

const toneClasses: Record<RadialTone, string> = {
  brand: "text-brand-600",
  success: "text-success-500",
  warning: "text-warning-500",
  danger: "text-danger-500",
};

const rawTones: Record<RadialTone, string> = {
  brand: "4f46e5",
  success: "22c55e",
  warning: "f59e0b",
  danger: "ef4444",
};

/**
 * ProgressRadial — round gauge with rounded caps, animated on mount.
 * Responsive-first: `size` prop scales it, defaults to 96px
 * (clamps down on tiny screens via min()).
 */
export function ProgressRadial({
  value,
  size = 96,
  stroke = 8,
  tone = "brand",
  label,
  sublabel,
  className,
}: ProgressRadialProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the arc from 0 on mount / when the value changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(clamped);
  }, [clamped]);

  const offset = c * (1 - progress / 100);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(clamped)}% ${sublabel ?? ""}`.trim()}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-surface-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`#${rawTones[tone]}`}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-lg font-bold leading-none", toneClasses[tone])}>
          {label ?? `${Math.round(clamped)}%`}
        </span>
        {sublabel && (
          <span className="mt-0.5 text-xs font-medium text-surface-400">{sublabel}</span>
        )}
      </div>
    </div>
  );
}