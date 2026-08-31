import { cn } from "@vaultui/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Size. `xs` = dense rows · `sm` = minimum comfortable touch (36px) · `md` = default · `lg`/`xl` = hero CTAs. Text + icons scale with each size. */
  size?: ButtonSize;
  /** Optional leading icon node. */
  leadingIcon?: ReactNode;
  /** Optional trailing icon node. */
  trailingIcon?: ReactNode;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** Makes the button take full width of its container. */
  fullWidth?: boolean;
}

/**
 * Sizes and variants are plain CSS classes (packages/ui/src/button.css) —
 * they work in Tailwind-scanned and non-scanned environments alike.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: "vault-btn-primary",
  secondary: "vault-btn-secondary",
  ghost: "vault-btn-ghost",
  danger: "vault-btn-danger",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "vault-btn-xs",
  sm: "vault-btn-sm",
  md: "vault-btn-md",
  lg: "vault-btn-lg",
  xl: "vault-btn-xl",
};

/**
 * Soft-UI (neumorphic) Button — surfaces lift via dual light/dark
 * shadows; `active:shadow-pressed` sinks the button into the canvas.
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  loading = false,
  fullWidth = false,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "vault-btn",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner className="size-4" />
      ) : (
        leadingIcon && <span aria-hidden="true" className="shrink-0">{leadingIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!loading && trailingIcon && (
        <span aria-hidden="true" className="shrink-0">{trailingIcon}</span>
      )}
    </button>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}