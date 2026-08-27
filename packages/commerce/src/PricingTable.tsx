import { Badge, Button } from "@gudipudimani/ui";
import { cn } from "@gudipudimani/utils";

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  cta: string;
  highlight?: boolean;
}

export interface PricingFeature {
  label: string;
  /** Extra explanation shown in a hover tooltip. */
  tooltip?: string;
  /** Feature value per plan id — true = included, false = not, string = detail. */
  values: Record<string, boolean | string>;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  features: PricingFeature[];
  className?: string;
}

/**
 * PricingTable — side-by-side feature matrix. Responsive-first:
 * scrolls horizontally on phones, tooltips on hover for lazy
 * questions, highlighted column for the popular plan.
 */
export function PricingTable({ plans, features, className }: PricingTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border-0 bg-surface-0 shadow-soft", className)}>
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr>
            <th className="w-1/3 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-surface-400 sm:px-5">
              Feature
            </th>
            {plans.map((p) => (
              <th
                key={p.id}
                className={cn(
                  "px-4 py-4 text-left align-top sm:px-5",
                  p.highlight && "bg-brand-50/60",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-surface-800">{p.name}</span>
                  {p.highlight && (
                    <Badge variant="brand" size="sm" dot>
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-bold">{p.price}</span>
                  {p.period && <span className="text-xs text-surface-400">{p.period}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((f, i) => (
            <tr key={f.label} className={cn("border-t border-surface-100", i % 2 === 1 && "bg-surface-50/50")}>
              <td className="px-4 py-3 text-sm font-medium text-surface-600 sm:px-5">
                <LabelWithTooltip label={f.label} tooltip={f.tooltip} />
              </td>
              {plans.map((p) => {
                const raw = f.values[p.id];
                return (
                  <td key={p.id} className={cn("px-4 py-3 sm:px-5", p.highlight && "bg-brand-50/60")}>
                    {typeof raw === "string" ? (
                      <span className="text-sm font-medium text-surface-700">{raw}</span>
                    ) : raw ? (
                      <CheckIcon className="size-4 text-brand-600" />
                    ) : (
                      <span className="text-sm text-surface-300">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-surface-100">
            <td className="px-4 py-4 sm:px-5" />
            {plans.map((p) => (
              <td key={p.id} className={cn("px-4 py-4 sm:px-5", p.highlight && "bg-brand-50/60")}>
                <Button variant={p.highlight ? "primary" : "secondary"} fullWidth size="sm">
                  {p.cta}
                </Button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function LabelWithTooltip({ label, tooltip }: { label: string; tooltip?: string }) {
  return (
    <span className="group relative inline-flex items-center gap-1">
      {label}
      {tooltip && (
        <>
          <InfoIcon className="size-3.5 text-surface-400" />
          <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 hidden w-max max-w-[220px] rounded-lg border border-surface-200 bg-surface-900 px-2.5 py-1.5 text-xs font-normal leading-relaxed text-surface-100 shadow-popover group-hover:block">
            {tooltip}
          </span>
        </>
      )}
    </span>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}