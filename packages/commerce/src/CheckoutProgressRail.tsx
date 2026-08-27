import { cn } from "@gudipudimani/utils";

export interface CheckoutStep {
  id: string;
  label: string;
  /** Optional helper shown under the label (desktop only). */
  hint?: string;
}

export interface CheckoutProgressRailProps {
  steps: CheckoutStep[];
  /** 0-based index of the active step. */
  current: number;
  /** Allow jumping to completed steps. */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * CheckoutProgressRail — stepped progress with connected circles,
 * animated fill and clickable completed steps. Labels collapse to
 * numbers on phones.
 */
export function CheckoutProgressRail({
  steps,
  current,
  onStepClick,
  className,
}: CheckoutProgressRailProps) {
  const progress = steps.length > 1 ? Math.min(100, (current / (steps.length - 1)) * 100) : 0;

  return (
    <div className={cn("w-full", className)} role="group" aria-label="Checkout progress">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={step.id} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <button
                type="button"
                disabled={i > current || !onStepClick}
                onClick={() => onStepClick?.(i)}
                className={cn(
                  "group flex shrink-0 flex-col items-center gap-1.5",
                  i <= current && onStepClick ? "cursor-pointer" : "cursor-default",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    done && "border-brand-600 bg-brand-600 text-white",
                    active && "border-brand-500 bg-brand-100 text-brand-700 ring-4 ring-brand-500/15",
                    !done && !active && "border-surface-300 bg-surface-0 text-surface-400",
                  )}
                >
                  {done ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hidden whitespace-nowrap text-xs font-medium text-surface-600 sm:block">
                  {step.label}
                </span>
              </button>

              {i < steps.length - 1 && (
                <div className="relative mx-1 h-px flex-1 bg-surface-200 sm:mx-2">
                  <div
                    className="absolute inset-y-0 left-0 bg-brand-500 transition-all duration-500"
                    style={{ width: `${i < current ? 100 : active ? progress % 100 : 0}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* mobile step label */}
      <p className="mt-2 text-center text-sm font-semibold text-surface-800 sm:hidden">
        {steps[current]?.label}
      </p>
    </div>
  );
}

export { CheckoutProgressRail as StepProgress };