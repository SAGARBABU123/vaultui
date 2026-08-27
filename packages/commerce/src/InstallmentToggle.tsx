import { cn } from "@vaultui/utils";
import { useState } from "react";

export interface InstallmentToggleProps {
  price: number;
  /** Number of interest-free installments (default 4). */
  months?: number;
  currency?: string;
  className?: string;
}

/**
 * InstallmentToggle — "Pay once" vs "4 × $X/mo" switcher.
 * Big-animating price on the left, toggle on the right; the
 * breakdown appears under the price when plan mode is active.
 */
export function InstallmentToggle({
  price,
  months = 4,
  currency = "$",
  className,
}: InstallmentToggleProps) {
  const [plan, setPlan] = useState(false);
  const perMonth = price / months;
  const total = perMonth * months;

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <div className="flex items-baseline gap-1.5">
          {plan ? (
            <>
              <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                {currency}
                {formatMoney(perMonth)}
              </span>
              <span className="text-sm text-surface-400">/mo for {months} months</span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                {currency}
                {price.toFixed(2)}
              </span>
              <span className="text-sm text-surface-400">one-time</span>
            </>
          )}
        </div>

        {plan && (
          <ul className="mt-2 space-y-1.5 text-sm text-surface-500">
            <li className="flex items-center gap-1.5">
              <span className="text-success-500">✓</span> Interest-free · total {currency}
              {formatMoney(total)}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-success-500">✓</span> Cancel anytime, keep the license
            </li>
          </ul>
        )}
      </div>

      {/* Toggle */}
      <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-surface-200 bg-surface-100 p-1 sm:self-center">
        {(["once", "plan"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={(!plan && mode === "once") || (plan && mode === "plan")}
            onClick={() => setPlan(mode === "plan")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              (mode === "once" && !plan) || (mode === "plan" && plan)
                ? "bg-surface-0 text-surface-900 shadow-soft"
                : "text-surface-500 hover:text-surface-700",
            )}
          >
            {mode === "once" ? "Pay once" : `${months} × /mo`}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatMoney(n: number) {
  return n.toFixed(n % 1 === 0 ? 0 : 2);
}