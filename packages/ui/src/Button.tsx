import { cn } from "@vault/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Size of the button. */
  size?: "sm" | "md" | "lg";
  /** Optional leading icon node. */
  leadingIcon?: ReactNode;
  /** Optional trailing icon node. */
  trailingIcon?: ReactNode;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** Makes the button take full width of its container. */
  fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-500 focus-visible:ring-brand-500",
  secondary:
    "bg-surface-100 text-surface-700 hover:bg-surface-200 focus-visible:ring-surface-400",
  ghost: "bg-transparent text-surface-600 hover:bg-surface-100 focus-visible:ring-surface-400",
  danger: "bg-danger-500 text-white hover:bg-danger-400 focus-visible:ring-danger-500",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

/**
 * The foundation Button — token-driven, demonstrates the theme engine.
 * Every visual property comes from @vault/tokens CSS variables,
 * so consumers can re-brand it by overriding tokens.
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
        "inline-flex select-none items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
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
        leadingIcon && <span aria-hidden="true">{leadingIcon}</span>
      )}
      {children}
      {!loading && trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
    </button>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
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