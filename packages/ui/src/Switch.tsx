import { useId } from "react";
import { cn } from "@vaultui/utils";

export interface SwitchProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Default (uncontrolled) state. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Size. Default "md". */
  size?: "sm" | "md";
  /** Accessible label (plain text or a rendered label). */
  label?: string;
  className?: string;
}

/** Token-driven toggle; styled via primitives.css (scan-independent). */
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  size = "md",
  label,
  className,
}: SwitchProps) {
  const id = useId();
  const controlled = checked !== undefined;
  const state = controlled ? checked : undefined;
  const handleClick = () => {
    if (disabled || controlled) return;
    onCheckedChange?.(!state);
  };
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={controlled ? state : defaultChecked}
      aria-label={label}
      disabled={disabled}
      onClick={controlled ? () => onCheckedChange?.(!state) : handleClick}
      className={cn("vault-switch", size === "sm" && "vault-switch--sm", className)}
    >
      <span className="vault-switch__thumb" />
    </button>
  );
}