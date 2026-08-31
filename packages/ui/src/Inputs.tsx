import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@vaultui/utils";

/* =============================== Field =================================== */

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label + hint/error wrapper for any input. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  return (
    <label className={cn("vault-field", className)}>
      {label && <span className="vault-field__label">{label}</span>}
      {children}
      {error ? (
        <span className="vault-field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="vault-field__hint">{hint}</span>
      ) : null}
    </label>
  );
}

/* ================================ Input =================================== */

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visual size. Default "md". */
  size?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = "md", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "vault-input",
        size === "sm" && "vault-input--sm",
        size === "lg" && "vault-input--lg",
        className,
      )}
      {...props}
    />
  );
});

/* =============================== Textarea ================================= */

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, ...props },
  ref,
) {
  return <textarea ref={ref} rows={rows} className={cn("vault-textarea", className)} {...props} />;
});

/* ================================ Select ================================== */

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  /** Shows a disabled placeholder item when value is undefined. */
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, placeholder, ...props },
  ref,
) {
  return (
    <select ref={ref} className={cn("vault-select", className)} {...props}>
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  );
});