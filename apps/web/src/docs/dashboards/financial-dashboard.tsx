import { useState } from "react";
import { Badge, Button } from "@vaultui/ui";
import { Sparkline, WaterfallChart } from "@vaultui/data-viz";
import { cn } from "@vaultui/utils";
import { Banknote, ChevronDown, Landmark, Receipt, TrendingUp, Wallet } from "lucide-react";

/**
 * Financial Dashboard — uistyleguide.com style: purpose-built for finance.
 * Accounting number formatting, red/green variance indicators, a drill-
 * through P&L table and a waterfall bridge. #FFFFFF / #1F2937 / #059669
 * palette. Built 100% from Vault tokens, so Neumorphic / Glassmorphism /
 * Dimensional Layering / Vintage Retro Film re-skin every statement,
 * table and chart.
 */

/* --------------------------------- data ---------------------------------- */

interface PnlRow {
  id: string;
  name: string;
  /** Positive magnitudes; `kind` decides direction + boldness. */
  amount: number;
  budget: number;
  kind: "revenue" | "expense" | "gross" | "operating" | "net";
  children?: PnlRow[];
}

const PNL: PnlRow[] = [
  {
    id: "revenue", name: "Revenue", amount: 12.84, budget: 12.32, kind: "revenue",
    children: [
      { id: "r1", name: "Product revenue", amount: 9.62, budget: 9.2, kind: "revenue" },
      { id: "r2", name: "Services & support", amount: 2.21, budget: 2.2, kind: "revenue" },
      { id: "r3", name: "Other income", amount: 1.01, budget: 0.92, kind: "revenue" },
    ],
  },
  {
    id: "cogs", name: "Cost of revenue", amount: 5.18, budget: 5.05, kind: "expense",
    children: [
      { id: "c1", name: "Materials & hosting", amount: 3.62, budget: 3.5, kind: "expense" },
      { id: "c2", name: "Fulfillment & support", amount: 1.56, budget: 1.55, kind: "expense" },
    ],
  },
  { id: "gross", name: "Gross profit", amount: 7.66, budget: 7.27, kind: "gross" },
  {
    id: "opex", name: "Operating expenses", amount: 4.31, budget: 4.42, kind: "expense",
    children: [
      { id: "o1", name: "R&D", amount: 2.14, budget: 2.2, kind: "expense" },
      { id: "o2", name: "Sales & marketing", amount: 1.52, budget: 1.6, kind: "expense" },
      { id: "o3", name: "G&A", amount: 0.65, budget: 0.62, kind: "expense" },
    ],
  },
  { id: "opinc", name: "Operating income (EBITDA)", amount: 3.35, budget: 2.85, kind: "operating" },
  { id: "net", name: "Net income", amount: 2.42, budget: 2.01, kind: "net" },
];

/** Waterfall bridge of the P&L, $M. */
const BRIDGE: { label: string; value: number; type: "delta" | "total" }[] = [
  { label: "Revenue", value: 12.84, type: "total" },
  { label: "COGS", value: -5.18, type: "delta" },
  { label: "OPEX", value: -4.31, type: "delta" },
  { label: "Tax & interest", value: -0.93, type: "delta" },
  { label: "Net income", value: 2.42, type: "total" },
];

/** Cash position, $M — 12 months. */
const CASH_POSITION = [9.4, 10.1, 10.8, 11.2, 11.9, 12.6, 13.4, 14.2, 15.1, 15.9, 16.8, 17.6];

/** Accounting number format: $12.8M / −$0.4M. */
const usd = (n: number) => (n < 0 ? `−$${Math.abs(n).toFixed(2).replace(/0$/, "")}M` : `$${n.toFixed(2).replace(/0$/, "")}M`);

/* ------------------------------- component ------------------------------- */

export function FinancialDashboardDemo() {
  const [expanded, setExpanded] = useState<string[]>(["revenue"]);
  const [selected, setSelected] = useState("net");

  const toggle = (id: string) =>
    setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  return (
    <div className="bg-surface-50">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 bg-surface-0 px-4 py-3 sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold tracking-tight text-surface-900">Financial Dashboard</p>
            <Badge variant="brand" size="sm" dot>close books</Badge>
          </div>
          <p className="mt-0.5 text-xs text-surface-400">Consolidated P&L · Q3 FY25 · USD · accounting convention</p>
        </div>
        <div className="flex items-center gap-2">
          <code className="rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-1.5 font-mono text-xs text-surface-700 shadow-inset">
            USD · accrual
          </code>
          <Button variant="secondary" size="sm" leadingIcon={<Receipt className="size-3.5" />}>
            Export GL
          </Button>
        </div>
      </div>

      {/* Statement KPIs with variance indicators */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:px-6 lg:grid-cols-4">
        {[
          { label: "Revenue", value: "$12.84M", variance: "+0.52M", fav: true, note: "vs budget · +4.2%" },
          { label: "Gross margin", value: "59.7%", variance: "+0.5pt", fav: true, note: "vs budget" },
          { label: "Operating expense", value: "$4.31M", variance: "−0.11M", fav: true, note: "under budget · favorable" },
          { label: "Free cash flow", value: "$2.06M", variance: "+0.18M", fav: true, note: "trailing 3 months" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-surface-500">{k.label}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-xs font-semibold",
                  k.fav ? "bg-success-500/10 text-success-500" : "bg-danger-500/10 text-danger-500",
                )}
              >
                {k.variance}
              </span>
            </div>
            <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-surface-900">{k.value}</p>
            <p className="mt-0.5 text-xs text-surface-400">{k.note}</p>
          </div>
        ))}
      </div>

      {/* P&L drill-through + charts */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 sm:px-6 lg:grid-cols-3">
        {/* Drill-through P&L table */}
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Profit &amp; loss</p>
              <Badge variant="neutral" size="sm">YTD actual vs budget</Badge>
            </div>
            <span className="hidden font-mono text-xs text-surface-400 sm:block">
              click a line to drill through
            </span>
          </div>

          {/* Table head */}
          <div className="mt-3 grid grid-cols-12 gap-2 border-b border-surface-200 pb-2 text-xs font-semibold uppercase tracking-wider text-surface-400">
            <span className="col-span-5">Line item</span>
            <span className="col-span-2 text-right">Actual</span>
            <span className="col-span-2 text-right">Budget</span>
            <span className="col-span-3 text-right">Variance</span>
          </div>

          <div className="mt-1">
            {PNL.map((row) => (
              <div key={row.id}>
                <PnlLine
                  row={row}
                  depth={0}
                  selected={selected === row.id}
                  onSelect={() => setSelected(row.id)}
                  expanded={expanded.includes(row.id)}
                  onToggle={() => toggle(row.id)}
                />
                {expanded.includes(row.id) &&
                  row.children?.map((child) => (
                    <PnlLine
                      key={child.id}
                      row={child}
                      depth={1}
                      selected={selected === child.id}
                      onSelect={() => setSelected(child.id)}
                    />
                  ))}
              </div>
            ))}
          </div>

          <p className="mt-3 rounded-xl bg-brand-50 px-3 py-2.5 text-xs leading-relaxed text-brand-700">
            Accounting convention: unfavourable variances print red, favourable print green.
            Negative figures use the finance minus (−). Expand any line item to drill through
            to its components.
          </p>
        </div>

        <div className="space-y-3">
          {/* P&L bridge */}
          <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">P&amp;L bridge</p>
            </div>
            <div className="mt-3">
              <WaterfallChart steps={BRIDGE} format={(n) => `$${(n / 10).toFixed(1)}M`} className="h-44" />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-surface-400">
              Revenue → cost of revenue → operating expenses → tax &amp; interest → net income.
              Total bars anchor at zero; deltas float on the running profit.
            </p>
          </div>

          {/* Cash flow */}
          <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Wallet className="size-4 text-brand-600" />
                <p className="text-sm font-semibold text-surface-800">Cash flow</p>
              </div>
              <Badge variant="success" size="sm">{usd(2.06)} net</Badge>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Operating", value: "$3.10M", tone: "text-success-500" },
                { label: "Investing", value: "−$0.70M", tone: "text-danger-500" },
                { label: "Financing", value: "−$0.34M", tone: "text-danger-500" },
              ].map((c) => (
                <div key={c.label} className="rounded-xl bg-surface-50 px-2 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-surface-400">{c.label}</p>
                  <p className={cn("mt-0.5 font-mono text-sm font-bold tabular-nums", c.tone)}>{c.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                Cash position · 12 months
              </p>
              <Sparkline data={CASH_POSITION} colorClass="text-success-500" fill className="mt-1 h-12 w-full" />
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-surface-100 pt-3">
              <div>
                <p className="text-xs text-surface-500">Runway</p>
                <p className="font-mono text-sm font-bold text-surface-900">14.2 mo</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm"><Banknote className="mr-1 size-3" /> Uplift hedge</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- sub-components ------------------------------- */

/** Favorable when: revenue lines run above budget, expense lines below. Green prints good. */
function variance(row: PnlRow) {
  const diff = row.amount - row.budget;
  const fav = row.kind === "expense" ? diff <= 0 : diff >= 0;
  const pct = row.budget === 0 ? 0 : (diff / row.budget) * 100;
  return { diff, pct, fav };
}

function PnlLine({
  row,
  depth,
  selected,
  expanded,
  onToggle,
  onSelect,
}: {
  row: PnlRow;
  depth: number;
  selected: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  onSelect: () => void;
}) {
  const hasChildren = !!row.children?.length;
  const { diff, pct, fav } = variance(row);
  const strong = row.kind === "gross" || row.kind === "operating" || row.kind === "net";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onSelect();
        if (hasChildren) onToggle?.();
      }}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "grid cursor-pointer grid-cols-12 items-center gap-2 rounded-lg px-2 py-[7px] transition-colors",
        depth > 0 && "ml-7 w-[calc(100%-1.75rem)]",
        selected ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-surface-50",
        row.kind === "net" && "bg-surface-100 ring-1 ring-surface-200",
      )}
    >
      <span className="col-span-5 flex min-w-0 items-center gap-1.5">
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            aria-label={expanded ? "Collapse line" : "Expand line"}
            className="inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-surface-500 hover:bg-surface-200/60"
          >
            <ChevronDown className={cn("size-3.5 transition-transform", (expanded || !hasChildren) && "-rotate-90")} />
          </button>
        )}
        <span
          className={cn(
            "truncate text-sm",
            depth > 0 ? "text-surface-500" : "text-surface-800",
            strong && "font-semibold",
            row.kind === "net" && "font-bold text-surface-900",
          )}
        >
          {row.name}
        </span>
      </span>

      <span className={cn("col-span-2 text-right font-mono text-xs tabular-nums", strong ? "font-semibold text-surface-900" : "text-surface-600")}>
        {usd(row.amount)}
      </span>
      <span className="col-span-2 text-right font-mono text-xs tabular-nums text-surface-400">{usd(row.budget)}</span>
      <span className="col-span-3 flex items-center justify-end gap-1.5">
        <span className={cn("font-mono text-xs font-semibold tabular-nums", fav ? "text-success-500" : "text-danger-500")}>
          {diff > 0 ? "+" : ""}{usd(diff)}
        </span>
        <span className={cn("rounded px-1 py-0.5 font-mono text-xs", fav ? "bg-success-500/10 text-success-500" : "bg-danger-500/10 text-danger-500")}>
          {pct > 0 ? "+" : ""}{pct.toFixed(1)}%
        </span>
      </span>
    </div>
  );
}