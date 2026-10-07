import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  /** When omitted, the crumb renders as the current (non-link) page. */
  to?: string;
}

/**
 * Where-am-I trail for the docs vault: `Docs / <kit> / <entry>`. The first
 * crumb always returns to the docs overview; the last is the current page.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-surface-500">
        <li>
          <Link
            to="/docs"
            className="rounded transition-colors hover:text-surface-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
          >
            Docs
          </Link>
        </li>
        {items.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-surface-300" />
            {crumb.to ? (
              <Link
                to={crumb.to}
                className="rounded transition-colors hover:text-surface-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-surface-700">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
