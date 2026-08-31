import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";

export interface Crumb {
  label: ReactNode;
  /** Omit to make the item plain text (current page). */
  href?: string;
}

export interface BreadcrumbProps {
  items: Crumb[];
  className?: string;
}

/** Breadcrumb trail with chevron separators; styled via primitives.css. */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("vault-crumbs", className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="vault-crumbs__wrap">
            {i > 0 && (
              <span className="vault-crumbs__sep" aria-hidden="true">
                <ChevronR />
              </span>
            )}
            {item.href && !last ? (
              <a className="vault-crumbs__item" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span className="vault-crumbs__item" aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function ChevronR() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}