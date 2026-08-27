import { cn } from "@gudipudimani/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tonal style of the badge. */
  variant?: BadgeVariant;
  /** Whether the badge shows a status dot before the label. */
  dot?: boolean;
  /** Size of the badge. */
  size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-surface-100 text-surface-700",
  brand: "bg-brand-100 text-brand-700",
  success: "bg-success-500/15 text-success-500",
  warning: "bg-warning-500/15 text-warning-500",
  danger: "bg-danger-500/15 text-danger-500",
  info: "bg-info-500/15 text-info-500",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

/**
 * Compact status/label chip. Inline-flex so it wraps gracefully
 * inside tight mobile layouts; pass `className="whitespace-nowrap"`
 * when truncation is preferred over wrapping.
 */
export function Badge({
  className,
  variant = "neutral",
  dot = false,
  size = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn("rounded-full bg-current", size === "sm" ? "size-1.5" : "size-2")}
        />
      )}
      {children}
    </span>
  );
}