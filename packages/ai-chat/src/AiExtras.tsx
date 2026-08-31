import { useMemo, useState } from "react";
import { cn } from "@vaultui/utils";
import { Input } from "@vaultui/ui";

/* ============================== TokenCostMeter ============================ */

export interface TokenCostMeterProps {
  inputTokens?: number;
  outputTokens?: number;
  /** Price per 1k tokens. */
  pricePer1kInput?: number;
  pricePer1kOutput?: number;
  className?: string;
}

export function TokenCostMeter({
  inputTokens = 2400,
  outputTokens = 640,
  pricePer1kInput = 0.02,
  pricePer1kOutput = 0.06,
  className,
}: TokenCostMeterProps) {
  const inputCost = (inputTokens / 1000) * pricePer1kInput;
  const outputCost = (outputTokens / 1000) * pricePer1kOutput;
  const total = inputCost + outputCost;
  return (
    <div className={cn("rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft", className)}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-surface-400">Token cost</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-surface-100 p-2.5 shadow-inset">
          <p className="text-lg font-bold text-brand-600">{inputTokens.toLocaleString()}</p>
          <p className="text-[11px] text-surface-400">input · ${inputCost.toFixed(4)}</p>
        </div>
        <div className="rounded-lg bg-surface-100 p-2.5 shadow-inset">
          <p className="text-lg font-bold text-success-500">{outputTokens.toLocaleString()}</p>
          <p className="text-[11px] text-surface-400">output · ${outputCost.toFixed(4)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-surface-100 pt-3">
        <span className="text-sm font-semibold text-surface-800">Est. request</span>
        <span className="font-mono text-lg font-bold text-surface-900">${total.toFixed(4)}</span>
      </div>
    </div>
  );
}

/* ================================= RAGSearch ============================== */

export interface RagResult {
  title: string;
  snippet: string;
  score: number;
  source?: string;
}

export interface RagSearchProps {
  results: RagResult[];
  placeholder?: string;
  className?: string;
}

export function RagSearch({ results, placeholder = "Search the knowledge base…", className }: RagSearchProps) {
  const [q, setQ] = useState("");
  const [searched, setSearched] = useState(false);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return results;
    return results.filter((r) => r.title.toLowerCase().includes(query) || r.snippet.toLowerCase().includes(query));
  }, [results, q]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
        <button
          type="button"
          className="vault-btn vault-btn-primary vault-btn-sm"
          onClick={() => setSearched(true)}
        >
          Search
        </button>
      </div>
      <ul className="space-y-2">
        {(searched ? filtered : results.slice(0, 2)).map((r, i) => (
          <li key={i} className="rounded-lg border border-surface-200 bg-surface-0 p-3 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-surface-900">{r.title}</p>
              <span className="shrink-0 rounded bg-brand-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-700">
                {Math.round(r.score * 100)}%
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-surface-500">{r.snippet}</p>
            {r.source && <p className="mt-1 font-mono text-[10px] text-surface-400">{r.source}</p>}
          </li>
        ))}
      </ul>
      {searched && filtered.length === 0 && <p className="text-sm text-surface-400">No results for “{q}”.</p>}
    </div>
  );
}

/* ================================ PromptDiff ============================== */

export interface PromptDiffProps {
  before: string;
  after: string;
  className?: string;
}

/** Line-level diff between two prompts — added/removed rows. */
export function PromptDiff({ before, after, className }: PromptDiffProps) {
  const lines = useMemo(() => {
    const a = before.split("\n");
    const b = after.split("\n");
    const max = Math.max(a.length, b.length);
    const rows: Array<{ before?: string; after?: string }> = [];
    for (let i = 0; i < max; i++) {
      const av = a[i];
      const bv = b[i];
      if (av === bv) rows.push({ after: bv });
      else rows.push({ before: av, after: bv });
    }
    return rows;
  }, [before, after]);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-surface-800 bg-surface-950 shadow-soft", className)}>
      <div className="flex items-center justify-between border-b border-surface-800 bg-surface-900 px-3 py-2">
        <span className="font-mono text-[11px] text-surface-400">prompt diff</span>
        <span className="flex gap-2">
          <span className="flex items-center gap-1 font-mono text-[10px] text-success-400"><AddBadge /> added</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-danger-400"><DelBadge /> removed</span>
        </span>
      </div>
      <pre className="max-h-56 overflow-auto p-3 font-mono text-[12px] leading-relaxed">
        {lines.map((l, i) => {
          if (l.before && l.after) {
            return (
              <span key={i} className="block">
                <DelBadge /> <span className="text-danger-400 line-through decoration-danger-500/60">{l.before}</span>
                <br />
                <AddBadge /> <span className="text-success-400">{l.after}</span>
              </span>
            );
          }
          if (l.before)
            return (
              <span key={i} className="block text-danger-400 line-through decoration-danger-500/60">
                <DelBadge /> {l.before}
              </span>
            );
          return (
            <span key={i} className="block text-surface-200">
              {l.after ? (
                <>
                  <AddBadge /> {l.after}
                </>
              ) : (
                <span className="inline-block">{"\u00A0"}</span>
              )}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

function AddBadge() {
  return <span className="mr-1 inline-flex size-3.5 items-center justify-center rounded-sm bg-success-500/20 text-[9px] font-bold text-success-400">+</span>;
}

function DelBadge() {
  return <span className="mr-1 inline-flex size-3.5 items-center justify-center rounded-sm bg-danger-500/20 text-[9px] font-bold text-danger-400">−</span>;
}