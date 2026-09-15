import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";

export interface TooltipProps {
  /** Text shown in the bubble. */
  label: string;
  /** Placement. Default "top". */
  placement?: "top" | "bottom";
  children: ReactNode;
  className?: string;
}

/** Hover/focus tooltip; styled via primitives.css. */
export function Tooltip({ label, placement = "top", children, className }: TooltipProps) {
  return (
    <span className={cn("vault-tooltip", className)} tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className={cn("vault-tooltip__pop", placement === "bottom" && "vault-tooltip__pop--bottom")}
        style={placement === "bottom" ? { top: "calc(100% + 8px)", bottom: "auto" } : undefined}
      >
        {label}
      </span>
    </span>
  );
}