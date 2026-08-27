import { cn } from "@gudipudimani/utils";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Internal padding. Defaults to `md`; override with className for responsive padding (`p-4 sm:p-6`). */
  padding?: "none" | "sm" | "md" | "lg";
  /** Elevation shadow. */
  shadow?: "none" | "soft" | "raised";
  /** Adds a border (on by default). */
  bordered?: boolean;
  /** Lifts the card on hover (border + shadow). */
  hover?: boolean;
}

const paddingClasses: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-8",
};

const shadowClasses: Record<NonNullable<CardProps["shadow"]>, string> = {
  none: "",
  soft: "shadow-soft",
  raised: "shadow-raised",
};

/**
 * Surface container. Responsive-first: default padding scales up
 * at the `sm` breakpoint, and consumers can pass `className`
 * (e.g. `"lg:col-span-2"`) for grid-aware layouts.
 */
export function Card({
  className,
  padding = "md",
  shadow = "soft",
  bordered = false,
  hover = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface-0",
        paddingClasses[padding],
        shadowClasses[shadow],
        bordered && "border border-surface-200",
        hover && "transition-shadow duration-200 hover:shadow-raised",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}