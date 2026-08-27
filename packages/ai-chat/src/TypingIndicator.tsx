import { cn } from "@gudipudimani/utils";
import type { HTMLAttributes } from "react";

export interface TypingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of dots (3 default). */
  dots?: number;
  /** Label read by screen readers. */
  label?: string;
}

/**
 * "LLM is thinking" indicator — three pulsing dots.
 * Responsive-first: dots scale with `em`, so it fits any container.
 */
export function TypingIndicator({
  dots = 3,
  label = "Assistant is thinking",
  className,
  ...props
}: TypingIndicatorProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      {Array.from({ length: dots }).map((_, i) => (
        <span
          key={i}
          className="size-2 rounded-full bg-surface-400 animate-bounce-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}