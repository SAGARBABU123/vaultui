import { cn } from "@vault/utils";
import { useMemo } from "react";

export interface DiffLine {
  type: "eq" | "del" | "add";
  text: string;
}

export interface DiffViewerProps {
  oldText: string;
  newText: string;
  oldLabel?: string;
  newLabel?: string;
  /** Language hint shown in the header. */
  language?: string;
  className?: string;
}

/** Line-based LCS diff — compact and dependency-free. */
function diffLines(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ type: "eq", text: a[i]! });
      i++;
      j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      out.push({ type: "del", text: a[i]! });
      i++;
    } else {
      out.push({ type: "add", text: b[j]! });
      j++;
    }
  }
  while (i < n) out.push({ type: "del", text: a[i++]! });
  while (j < m) out.push({ type: "add", text: b[j++]! });
  return out;
}

/**
 * DiffViewer — side-by-side line diff (LCS, no deps) with
 * added/deleted counts and a scroll-synced pair of panes.
 * Responsive-first: panes become a single scroll area on phones.
 */
export function DiffViewer({
  oldText,
  newText,
  oldLabel = "old",
  newLabel = "new",
  language = "text",
  className,
}: DiffViewerProps) {
  const diff = useMemo(() => diffLines(oldText.split("\n"), newText.split("\n")), [oldText, newText]);

  const rows: { left: DiffLine | null; right: DiffLine | null }[] = diff.map((line) => {
    if (line.type === "eq") {
      return { left: line, right: line };
    }
    if (line.type === "del") {
      return { left: line, right: null };
    }
    return { left: null, right: line };
  });

  const added = diff.filter((l) => l.type === "add").length;
  const removed = diff.filter((l) => l.type === "del").length;

  return (
    <div className={cn("overflow-hidden rounded-2xl border-0 bg-surface-0 shadow-soft", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-200 bg-surface-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-surface-500">{language}</span>
          <span className="rounded-full bg-danger-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-danger-500">
            -{removed}
          </span>
          <span className="rounded-full bg-success-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-success-500">
            +{added}
          </span>
        </div>
        <div className="hidden items-center gap-3 font-mono text-xs text-surface-400 sm:flex">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-danger-500/70" /> {oldLabel}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-success-500/70" /> {newLabel}
          </span>
        </div>
      </div>

      {/* Body — side by side */}
      <div className="grid max-h-80 grid-cols-2 overflow-auto font-mono text-[13px] leading-5">
        <div className="min-w-0 border-r border-surface-200">
          {rows.map((row, i) => (
            <Line key={i} line={row.left} side="left" />
          ))}
        </div>
        <div className="min-w-0">
          {rows.map((row, i) => (
            <Line key={i} line={row.right} side="right" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Line({ line, side }: { line: DiffLine | null; side: "left" | "right" }) {
  if (!line) return <div className="h-5 bg-surface-50/50" aria-hidden="true" />;

  const cls =
    line.type === "eq"
      ? "text-surface-600"
      : line.type === "del"
        ? "bg-danger-500/[0.08] text-danger-600"
        : "bg-success-500/[0.08] text-success-600";

  return (
    <div className={cn("flex items-center gap-2 px-3 whitespace-pre", cls)}>
      <span className={cn("w-4 shrink-0 select-none text-center", line.type === "eq" ? "text-surface-300" : "")}>
        {line.type === "del" ? "−" : line.type === "add" ? "+" : " "}
      </span>
      <span className={cn("truncate", side === "left" && line.type === "add" && "opacity-0")}>
        {line.text}
      </span>
    </div>
  );
}