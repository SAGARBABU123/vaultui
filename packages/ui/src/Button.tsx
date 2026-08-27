import { cn } from "@vaultui/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Size. `xs` = dense rows · `sm` = minimum comfortable touch (36px) · `md` = default · `lg`/`xl` = hero CTAs. */
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
 * Responsive-first: pass `fullWidth` + `className="w-full sm:w-auto"`
 * to switch between stacked (mobile) and inline (desktop) layouts.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-500 active:shadow-pressed focus-visible:ring-brand-500",
  secondary:
    "bg-surface-0 text-surface-700 shadow-soft hover:bg-surface-50 active:shadow-pressed focus-visible:ring-surface-400",
  ghost:
    "bg-transparent text-surface-600 hover:bg-surface-100 active:shadow-inset focus-visible:ring-surface-400",
  danger: "bg-danger-500 text-white shadow-soft hover:bg-danger-400 active:shadow-pressed focus-visible:ring-danger-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-5 text-base gap-2 rounded-lg",
  xl: "h-14 px-7 text-base gap-2.5 rounded-lg",
};

const focusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0";

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
        "relative inline-flex select-none items-center justify-center whitespace-nowrap font-medium leading-none",
        "transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        focusClasses,
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