import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@vaultui/utils";

export interface TableColumn<R extends Record<string, unknown> = Record<string, unknown>> {
  key: string;
  label: ReactNode;
  /** Render a custom cell. */
  render?: (row: R) => ReactNode;
  /** Sort by this column (string/number comparison). */
  sortable?: boolean;
  align?: "left" | "right" | "center";
}

export interface DataTableProps<R extends Record<string, unknown> = Record<string, unknown>> {
  columns: TableColumn<R>[];
  rows: R[];
  /** Rows per page. 0 = no pagination. */
  pageSize?: number;
  /** Hide sorting UI while letting rows stay in given order. */
  sortable?: boolean;
  empty?: ReactNode;
  className?: string;
}

export function DataTable<R extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  rows,
  pageSize = 8,
  sortable = true,
  empty = "No rows to show.",
  className,
}: DataTableProps<R>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const toggleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    const get = (r: R) => (col?.render ? String(col.render(r) ?? "") : r[sortKey]);
    return [...rows].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / Math.max(1, pageSize)));
  const current = page >= pages ? 0 : page;
  const visible = pageSize > 0 ? sorted.slice(current * pageSize, current * pageSize + pageSize) : sorted;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-surface-200 bg-surface-0 shadow-soft", className)}>
      <div className="overflow-x-auto">
        <table className="vault-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: col.align ?? "left" }}>
                  {col.sortable && sortable ? (
                    <button type="button" className="vault-table__sort" onClick={() => toggleSort(col.key)} aria-label={`Sort by ${col.key}`}>
                      {col.label}
                      {sortKey === col.key ? (
                        <SortArrow dir={sortDir} />
                      ) : (
                        <SortArrow dir="none" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-sm text-surface-400">
                  {empty}
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align ?? "left" }}>
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize > 0 && sorted.length > pageSize && (
        <div className="flex items-center justify-between border-t border-surface-100 px-4 py-2.5">
          <span className="text-xs text-surface-400">
            {current * pageSize + 1}–{Math.min((current + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={current === 0} className="vault-btn vault-btn-ghost vault-btn-xs">
              Prev
            </button>
            <span className="px-2 font-mono text-xs text-surface-500">
              {current + 1}/{pages}
            </span>
            <button type="button" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={current >= pages - 1} className="vault-btn vault-btn-ghost vault-btn-xs">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortArrow({ dir }: { dir: "asc" | "desc" | "none" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("size-3", dir === "none" ? "opacity-30" : "text-brand-600")}
      aria-hidden="true"
    >
      {dir === "asc" ? (
        <path d="M10 4l4 5H6l4-5z" />
      ) : dir === "desc" ? (
        <path d="M10 16l-4-5h8l-4 5z" />
      ) : (
        <path d="M10 4l4 5H6l4-5zM10 16l-4-5h8l-4 5z" />
      )}
    </svg>
  );
}