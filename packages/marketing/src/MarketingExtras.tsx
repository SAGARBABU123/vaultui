import { useState, type ReactNode } from "react";
import { cn } from "@vaultui/utils";
import { Button, Input } from "@vaultui/ui";

/* ============================== PricingSection ============================ */

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  cta?: ReactNode;
}

export interface PricingSectionProps {
  plans: PricingPlan[];
  className?: string;
}

export function PricingSection({ plans, className }: PricingSectionProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {plans.map((p) => (
        <div
          key={p.name}
          className={cn(
            "relative flex flex-col rounded-2xl border p-5",
            p.highlighted
              ? "border-brand-300 shadow-raised"
              : "border-surface-200 bg-surface-0 shadow-soft",
          )}
          style={p.highlighted ? { background: "linear-gradient(180deg, var(--color-brand-50), var(--color-surface-0))" } : undefined}
        >
          {p.highlighted && (
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Popular
            </span>
          )}
          <h3 className="text-sm font-semibold text-surface-800">{p.name}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-surface-900">{p.price}</span>
            {p.period && <span className="text-xs text-surface-400">/{p.period}</span>}
          </div>
          {p.description && <p className="mt-2 text-[13px] leading-relaxed text-surface-500">{p.description}</p>}
          <ul className="mt-4 flex-1 space-y-2 border-t border-surface-100 pt-4">
            {p.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-surface-600">
                <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5">{p.cta ?? <Button className="vault-btn-primary w-full">Choose {p.name}</Button>}</div>
        </div>
      ))}
    </div>
  );
}

/* ================================= CTABand ================================ */

export interface CtaBandProps {
  title: ReactNode;
  body?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function CtaBand({ title, body, primaryAction, secondaryAction, className }: CtaBandProps) {
  return (
    <section
      className={cn("relative overflow-hidden rounded-2xl p-8 text-center sm:p-12", className)}
      style={{
        background:
          "radial-gradient(120% 160% at 50% 0%, var(--color-brand-100) 0%, var(--color-surface-50) 60%)",
      }}
    >
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">{title}</h2>
      {body && <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-surface-500">{body}</p>}
      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </section>
  );
}

/* ============================= IntegrationsGrid =========================== */

export interface Integration {
  name: string;
  icon?: ReactNode;
  description: string;
  tag?: string;
}

export interface IntegrationsGridProps {
  integrations: Integration[];
  className?: string;
}

// Theme-aware tile palette — reads the active theme's CSS variables so the
// grid re-skins across all four themes instead of hardcoding hex.
const TILE_COLORS = [
  "var(--color-brand-600, #5b66e8)",
  "var(--color-success-500, #2fbf7f)",
  "var(--color-warning-500, #e8a93d)",
  "var(--color-info-500, #5aa7e2)",
  "var(--color-danger-500, #e56b7a)",
  "var(--color-brand-400, #8b96f7)",
];

export function IntegrationsGrid({ integrations, className }: IntegrationsGridProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {integrations.map((it, i) => (
        <div key={it.name} className="flex items-start gap-3 rounded-xl border border-surface-200 bg-surface-0 p-3.5 shadow-soft transition-all hover:-translate-y-0.5">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: TILE_COLORS[i % TILE_COLORS.length] }}
          >
            {it.icon ?? it.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-surface-800">{it.name}</p>
              {it.tag && <span className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-[10px] text-surface-400">{it.tag}</span>}
            </div>
            <p className="mt-0.5 text-[13px] leading-relaxed text-surface-500">{it.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================ ComparisonSection =========================== */

export interface ComparisonColumn {
  label: string;
  highlighted?: boolean;
  rows: Array<boolean | string>;
}

export interface ComparisonSectionProps {
  features: string[];
  columns: ComparisonColumn[];
  className?: string;
}

export function ComparisonSection({ features, columns, className }: ComparisonSectionProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-surface-200 bg-surface-0 shadow-soft", className)}>
      <table className="vault-table min-w-[520px]">
        <thead>
          <tr>
            <th>Features</th>
            {columns.map((c) => (
              <th
                key={c.label}
                style={{
                  textAlign: "center",
                  color: c.highlighted ? "var(--color-brand-700)" : undefined,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((f, i) => (
            <tr key={f}>
              <td className="font-medium text-surface-700">{f}</td>
              {columns.map((c) => {
                const v = c.rows[i];
                return (
                  <td key={c.label} style={{ textAlign: "center" }}>
                    {typeof v === "boolean" ? (
                      <span className={cn("inline-flex size-5 items-center justify-center rounded-full", v ? "bg-success-500/15 text-success-500" : "bg-surface-100 text-surface-300")}>
                        {v ? <CheckIcon className="size-3" /> : <MinusIcon className="size-3" />}
                      </span>
                    ) : (
                      <span className="text-[13px] text-surface-700">{v}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------- icons ----------------------------------- */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}