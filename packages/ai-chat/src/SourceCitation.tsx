import { cn } from "@vaultui/utils";
import type { ButtonHTMLAttributes } from "react";
import type { SourceCitationItem } from "./types";

export interface SourceCitationProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The citation this chip represents. */
  citation: SourceCitationItem;
  /** Whether this chip is currently active/selected. */
  active?: boolean;
}

/**
 * Clickable footnote chip ("[1] Title") for RAG answers.
 * Responsive-first: chips wrap naturally and truncate long titles
 * on narrow screens while keeping the index visible.
 */
export function SourceCitation({
  citation,
  active = false,
  className,
  ...props
}: SourceCitationProps) {
  return (
    <button
      type="button"
      className={cn(
        "group inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-brand-400 bg-brand-600 text-white"
          : "border-surface-200 bg-surface-0 text-surface-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
          active ? "bg-white/20" : "bg-surface-100 text-surface-500 group-hover:bg-brand-100 group-hover:text-brand-700",
        )}
      >
        {citation.index}
      </span>
      <span className="truncate">{citation.title}</span>
      {citation.domain && (
        <span className={cn("hidden truncate sm:inline", active ? "text-white/70" : "text-surface-400")}>
          · {citation.domain}
        </span>
      )}
    </button>
  );
}