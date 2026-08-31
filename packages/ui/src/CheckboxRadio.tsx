import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";

/* =============================== Checkbox ================================= */

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Label text rendered beside the box. */
  children?: ReactNode;
  className?: string;
}

export function Checkbox({ checked, defaultChecked = false, onChange, disabled, children, className }: CheckboxProps) {
  const controlled = checked !== undefined;
  const current = controlled ? checked : defaultChecked;
  return (
    <label className={cn("vault-check", className)}>
      <input
        type="checkbox"
        checked={current}
        disabled={disabled}
        onChange={(e) => {
          if (controlled) onChange?.(e.target.checked);
        }}
      />
      <span className="vault-check__box" aria-hidden="true" />
      {children && <span>{children}</span>}
    </label>
  );
}

/* ============================== RadioGroup ================================ */

export interface RadioOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({ options, value, onValueChange, disabled, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn("vault-radio-group", className)}>
      {options.map((o) => (
        <label key={o.value} className={cn("vault-radio", (disabled || o.disabled) && "opacity-55 cursor-not-allowed")}>
          <input
            type="radio"
            name={`radio-${value ?? "group"}`}
            value={o.value}
            checked={value === o.value}
            disabled={disabled || o.disabled}
            onChange={() => onValueChange?.(o.value)}
          />
          <span className="vault-radio__dot" aria-hidden="true" />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}