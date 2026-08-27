import { Copy, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@vault/utils";

export interface SqlBuilderProps {
  /** Schema columns shown in the pickers. */
  columns: string[];
  table?: string;
  onQueryChange?: (sql: string) => void;
  className?: string;
}

interface WhereRow {
  id: number;
  col: string;
  op: string;
  value: string;
}

const OPS = ["=", "!=", ">", "<", ">=", "<=", "LIKE", "IN"];

/**
 * SqlBuilder — build a SELECT visually: choose columns, stack WHERE
 * clauses with operators, set a LIMIT; SQL compiles live.
 */
export function SqlBuilder({ columns, table = "users", onQueryChange, className }: SqlBuilderProps) {
  const [selected, setSelected] = useState<string[]>([columns[0] ?? "*"]);
  const [wheres, setWheres] = useState<WhereRow[]>([
    { id: 1, col: columns[0] ?? "id", op: ">", value: "0" },
  ]);
  const [limit, setLimit] = useState(100);

  const sql = useMemo(() => {
    const cols = selected.includes("*") ? "*" : selected.join(", ");
    const where = wheres
      .filter((w) => w.col && w.value.trim() !== "")
      .map((w) => `${w.col} ${w.op} ${w.op === "LIKE" ? `'%${w.value}%'` : w.op === "IN" ? `(${w.value})` : w.value}`)
      .join(" AND ");
    return `SELECT ${cols}\nFROM ${table}${where ? `\nWHERE ${where}` : ""}\nLIMIT ${limit};`;
  }, [selected, wheres, limit, table]);

  useEffect(() => {
    onQueryChange?.(sql);
  }, [sql, onQueryChange]);

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  const toggleCol = (col: string) => {
    setSelected((s) => {
      if (col === "*") return s.includes("*") ? s.filter((c) => c !== "*") : [col];
      const next = s.includes(col) ? s.filter((c) => c !== col) : [...s.filter((c) => c !== "*"), col];
      return next.length === 0 ? [columns[0] ?? "*"] : next;
    });
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-soft", className)}>
      <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
        {/* Builder */}
        <div className="border-b border-surface-200 p-4 lg:border-b-0 lg:border-r">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-surface-400">Select columns</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip on={selected.includes("*")} onClick={() => toggleCol("*")} label="*" />
            {columns.map((c) => (
              <Chip key={c} on={selected.includes(c)} onClick={() => toggleCol(c)} label={c} />
            ))}
          </div>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-surface-400">Where</h3>
          <div className="mt-2 space-y-2">
            {wheres.map((w) => (
              <div key={w.id} className="flex items-center gap-1.5">
                <select
                  value={w.col}
                  onChange={(e) => setWheres((ws) => ws.map((x) => (x.id === w.id ? { ...x, col: e.target.value } : x)))}
                  aria-label="Column"
                  className="h-8 w-28 rounded-md border border-surface-200 bg-surface-50 px-1.5 text-xs outline-none"
                >
                  {columns.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={w.op}
                  onChange={(e) => setWheres((ws) => ws.map((x) => (x.id === w.id ? { ...x, op: e.target.value } : x)))}
                  aria-label="Operator"
                  className="h-8 w-16 rounded-md border border-surface-200 bg-surface-50 px-1.5 text-xs outline-none"
                >
                  {OPS.map((op) => (
                    <option key={op}>{op}</option>
                  ))}
                </select>
                <input
                  value={w.value}
                  onChange={(e) => setWheres((ws) => ws.map((x) => (x.id === w.id ? { ...x, value: e.target.value } : x)))}
                  placeholder="value"
                  aria-label="Value"
                  className="h-8 w-full min-w-0 rounded-md border border-surface-200 bg-surface-50 px-2 text-xs outline-none focus:border-brand-400"
                />
                <button
                  type="button"
                  aria-label="Remove clause"
                  onClick={() => setWheres((ws) => ws.filter((x) => x.id !== w.id))}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-surface-400 hover:bg-surface-100 hover:text-danger-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setWheres((ws) => [...ws, { id: Date.now(), col: columns[0] ?? "id", op: "=", value: "" }])
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              <Plus className="size-3.5" /> Add clause
            </button>

            <label className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-surface-500">Limit</span>
              <input
                type="number"
                min={1}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="h-8 w-20 rounded-md border border-surface-200 bg-surface-50 px-2 text-xs outline-none focus:border-brand-400"
              />
            </label>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col bg-surface-950 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-surface-500">Generated SQL</span>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy SQL"
              className={cn("rounded-md p-1.5 transition-colors", copied ? "bg-success-500/20 text-success-400" : "text-surface-400 hover:bg-surface-800 hover:text-surface-200")}
            >
              <Copy className="size-3.5" />
            </button>
          </div>
          <pre className="flex-1 overflow-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-surface-200">
            <code>{sql}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-1 font-mono text-xs transition-colors",
        on ? "border-brand-400 bg-brand-50 text-brand-700" : "border-surface-200 bg-surface-50 text-surface-500 hover:border-brand-300",
      )}
    >
      {label}
    </button>
  );
}