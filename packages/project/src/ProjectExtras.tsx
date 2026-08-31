import { cn } from "@vaultui/utils";

/* ============================== BurndownChart ============================= */

export interface BurndownChartProps {
  /** Total points remaining each day. */
  remaining: number[];
  /** Starting scope (for the ideal line). Defaults to remaining[0]. */
  total?: number;
  labels?: string[];
  className?: string;
}

/** Sprint burndown — ideal linear line vs actual remaining points. */
export function BurndownChart({ remaining, total, labels, className }: BurndownChartProps) {
  const start = total ?? remaining[0] ?? 0;
  const W = 400;
  const H = 160;
  const x = (i: number, len: number) => 16 + (i / Math.max(1, len - 1)) * (W - 32);
  const y = (v: number) => 14 + (1 - v / Math.max(1, start)) * (H - 28);
  const line = remaining.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i, remaining.length)} ${y(v)}`).join(" ");
  const ideal = `M ${x(0, remaining.length)} ${y(start)} L ${x(remaining.length - 1, remaining.length)} ${y(0)}`;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 260, height: "auto" }} role="img" aria-label="Burndown chart">
        <line x1={16} x2={W - 16} y1={H - 14} y2={H - 14} stroke="var(--color-surface-200)" strokeWidth="1" />
        <path d={ideal} fill="none" stroke="var(--color-surface-300)" strokeWidth="2" strokeDasharray="4 4" />
        <path d={line} fill="none" stroke="var(--color-brand-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {remaining.map((v, i) => (
          <circle key={i} cx={x(i, remaining.length)} cy={y(v)} r="3" fill="var(--color-brand-600)" className="vault-chart-dot">
            <title>{`${labels?.[i] ?? "day " + (i + 1)}: ${v}`}</title>
          </circle>
        ))}
      </svg>
      {labels && (
        <div className="vault-chart-xaxis">
          {labels.map((l, i) => (
            <span key={i} style={{ left: `${(i / Math.max(1, labels.length - 1)) * 100}%` }}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================= DependencyGraph ============================ */

export interface GraphNode {
  id: string;
  label: string;
  layer?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface DependencyGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  className?: string;
}

/** Layered dependency graph — nodes on horizontal layers, edges as bezier curves. */
export function DependencyGraph({ nodes, edges, className }: DependencyGraphProps) {
  const layers = new Map<number, GraphNode[]>();
  for (const n of nodes) {
    const l = n.layer ?? 0;
    const list = layers.get(l) ?? [];
    list.push(n);
    layers.set(l, list);
  }
  const W = 420;
  const H = 170;
  const pos = new Map<string, { x: number; y: number }>();
  const maxLayer = Math.max(0, ...layers.keys());
  for (const [l, list] of layers) {
    const lw = W - 60;
    list.forEach((n, i) => {
      pos.set(n.id, {
        x: 30 + (l / Math.max(1, maxLayer)) * lw + (maxLayer === 0 ? lw : 0) * 0,
        y: 24 + (i / Math.max(1, list.length - 1)) * (H - 48),
      });
    });
  }
  // Evenly spread layers across width
  for (const n of nodes) {
    const p = pos.get(n.id)!;
    const layerCount = layers.get(n.layer ?? 0)?.length ?? 1;
    p.x = 30 + ((n.layer ?? 0) / Math.max(1, maxLayer)) * (W - 60);
    p.y = 22 + ((((nodes.filter((m) => (m.layer ?? 0) === (n.layer ?? 0)).indexOf(n)) + 0.5) / Math.max(1, layerCount))) * (H - 44);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 260, height: "auto" }} className={cn("overflow-visible", className)} role="img" aria-label="Dependency graph">
      {edges.map((e, i) => {
        const a = pos.get(e.from)!;
        const b = pos.get(e.to)!;
        return (
          <path
            key={i}
            d={`M ${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`}
            fill="none"
            stroke="var(--color-surface-300)"
            strokeWidth="1.5"
          />
        );
      })}
      {nodes.map((n) => {
        const p = pos.get(n.id)!;
        return (
          <g key={n.id}>
            <circle cx={p.x} cy={p.y} r="7" fill="var(--color-brand-600)" stroke="var(--color-surface-0)" strokeWidth="2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" style={{ fontSize: 9, fill: "#fff", fontWeight: 700 }}>
              {n.label.slice(0, 2)}
            </text>
            <text x={p.x + 12} y={p.y + 3} style={{ fontSize: 10, fill: "var(--color-surface-500)" }}>{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ================================= OKRTree ================================ */

export interface OkrKeyResult {
  label: string;
  progress: number;
}

export interface OkrItem {
  objective: string;
  keyResults: OkrKeyResult[];
}

export interface OkrTreeProps {
  objectives: OkrItem[];
  className?: string;
}

export function OkrTree({ objectives, className }: OkrTreeProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {objectives.map((o, i) => {
        const avg = Math.round(o.keyResults.reduce((n, k) => n + k.progress, 0) / Math.max(1, o.keyResults.length));
        return (
          <div key={i} className="rounded-xl border border-surface-200 bg-surface-0 p-3.5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-surface-800">{o.objective}</p>
              <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-700">{avg}%</span>
            </div>
            <ul className="mt-2.5 space-y-2">
              {o.keyResults.map((k, j) => (
                <li key={j} className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[1fr_auto]">
                  <span className="truncate text-[13px] text-surface-500">{k.label}</span>
                  <span className="col-span-2 flex items-center gap-2 sm:col-span-1">
                    <span className="h-1.5 w-full overflow-hidden rounded-full bg-surface-100">
                      <span className="block h-full rounded-full bg-brand-600" style={{ width: `${k.progress}%` }} />
                    </span>
                    <span className="w-8 text-right font-mono text-[10px] text-surface-400">{k.progress}%</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}