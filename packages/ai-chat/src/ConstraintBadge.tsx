import { cn } from "@vaultui/utils";

export type ConstraintTone = "normal" | "warn" | "danger";

export interface ConstraintItem {
  label: string;
  /** e.g. "4.2k / 128k". */
  value: string;
  /** 0–100 usage for the mini progress bar. */
  percent?: number;
  tone?: ConstraintTone;
  kind?: "tokens" | "rate" | "cost" | "latency";
}

export interface ConstraintBadgeProps {
  items: ConstraintItem[];
  /** Compact: hides labels on small screens (icon + value only). */
  compact?: boolean;
  className?: string;
}

const toneText: Record<ConstraintTone, string> = {
  normal: "text-surface-800",
  warn: "text-warning-500",
  danger: "text-danger-500",
};

const toneBar: Record<ConstraintTone, string> = {
  normal: "bg-brand-600",
  warn: "bg-warning-500",
  danger: "bg-danger-500",
};

/**
 * ConstraintBadge — live token / rate / cost / latency indicators.
 * Wraps naturally on narrow screens; each pill shows an icon, label,
 * value, and an optional usage bar so users see limits at a glance.
 */
export function ConstraintBadge({ items, compact = false, className }: ConstraintBadgeProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)} role="status" aria-label="Usage constraints">
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-surface-200 bg-surface-0 px-2 py-1"
        >
          <KindIcon kind={item.kind ?? "tokens"} />
          {!compact && (
            <span className="hidden text-xs font-medium text-surface-400 sm:inline">
              {item.label}
            </span>
          )}
          <span className={cn("font-mono text-xs font-semibold", toneText[item.tone ?? "normal"])}>
            {item.value}
          </span>
          {item.percent !== undefined && (
            <span className="ml-0.5 inline-block h-1.5 w-12 overflow-hidden rounded-full bg-surface-100">
              <span
                className={cn("block h-full rounded-full transition-all", toneBar[item.tone ?? "normal"])}
                style={{ width: `${Math.min(100, Math.max(0, item.percent))}%` }}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function KindIcon({ kind }: { kind: NonNullable<ConstraintItem["kind"]> }) {
  const base = "size-3 shrink-0 text-surface-400";
  switch (kind) {
    case "tokens":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={base} aria-hidden="true">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm4.66 3.1L6.1 14.66A6.45 6.45 0 014 10a6 6 0 0110.66-3.9zM11 4.2c.73.16 1.42.45 2.05.84L6.04 13.05a7.9 7.9 0 01-.84-2.05L11 4.2z" opacity=".9" />
        </svg>
      );
    case "rate":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={base} aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "cost":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={base} aria-hidden="true">
          <path d="M10.75 10.818l-2.614-.583A1.788 1.788 0 017.542 7.75h2.408a1.748 1.748 0 01.8 3.068zm1.322-5.61l.42-1.204A6.75 6.75 0 1018 9.25h-1.5a5.25 5.25 0 11-4.428-5.042z" />
          <path d="M10.75 10.818h3.25a.75.75 0 010 1.5h-4.25a.75.75 0 01-.75-.75v-1.21l.25-.092z" opacity=".8" />
        </svg>
      );
    case "latency":
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={base} aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v5.16a.75.75 0 00.22.53l3.5 3.5a.75.75 0 001.06-1.06L10.75 9.58V4.75z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
}