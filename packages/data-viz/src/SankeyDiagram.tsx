import { cn } from "@vaultui/utils";

export interface SankeyNode {
  id: string;
  label: string;
  value: number;
}

export interface SankeyLink {
  from: string;
  to: string;
  value: number;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  className?: string;
}

const W = 320;
const H = 220;
const COL_W = 44;
const PAD = { top: 10, bottom: 10 };

/**
 * SankeyDiagram — two-layer flow diagram (e.g. source → outcome).
 * Node heights are value-proportional; link ribbons use cubic curves.
 */
export function SankeyDiagram({ nodes, links, className }: SankeyDiagramProps) {
  const left = nodes.filter((n) => links.some((l) => l.from === n.id));
  const right = nodes.filter((n) => links.some((l) => l.to === n.id));

  const layout = (list: SankeyNode[]) => {
    const total = list.reduce((s, n) => s + n.value, 0);
    const usable = H - PAD.top - PAD.bottom;
    let offset = PAD.top;
    return list.map((node) => {
      const h = (node.value / total) * usable;
      const rect = { node, top: offset, h, bottom: offset + h };
      offset += h;
      return rect;
    });
  };

  const lLeft = layout(left);
  const lRight = layout(right);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full aspect-[16/11]", className)} role="img" aria-label="Sankey diagram">
      {/* ribbons */}
      {links.map((l, i) => {
        const a = lLeft.find((r) => r.node.id === l.from);
        const b = lRight.find((r) => r.node.id === l.to);
        if (!a || !b) return null;
        const midX = COL_W + (W - COL_W * 2) / 2;
        const d = `M ${COL_W} ${a.top + a.h / 2} C ${midX} ${a.top + a.h / 2}, ${midX} ${b.top + b.h / 2}, ${W - COL_W} ${b.top + b.h / 2}`;
        const width = (l.value / Math.max(1, ...links.map((x) => x.value))) * 20 + 2;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={width}
            strokeOpacity={0.3}
            strokeLinecap="round"
            className="transition-opacity hover:stroke-[.55]"
          />
        );
      })}

      {/* left nodes */}
      {lLeft.map((r) => (
        <g key={r.node.id}>
          <rect x={4} y={r.top} width={COL_W - 6} height={r.h} rx="3" fill="currentColor" fillOpacity="0.82" />
          <text x={8} y={Math.max(10, r.top + Math.min(12, r.h / 2))} fontSize="9" fill="var(--color-surface-0, #fff)" className="font-medium">
            {r.node.label.slice(0, 12)}
          </text>
        </g>
      ))}

      {/* right nodes */}
      {lRight.map((r) => (
        <g key={r.node.id}>
          <rect x={W - COL_W + 2} y={r.top} width={COL_W - 6} height={r.h} rx="3" fill="currentColor" fillOpacity="0.35" />
          <text x={W - COL_W + 8} y={Math.max(10, r.top + Math.min(12, r.h / 2))} fontSize="9" fill="currentColor" fillOpacity="0.75">
            {r.node.label.slice(0, 12)}
          </text>
        </g>
      ))}
    </svg>
  );
}