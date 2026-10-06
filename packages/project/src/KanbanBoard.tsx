import { cn } from "@vaultui/utils";
import { useState } from "react";

export interface KanbanCard {
  id: string;
  title: string;
  tag?: string;
  tagColor?: "brand" | "success" | "warning" | "danger" | "info";
}

export interface KanbanColumn {
  id: string;
  title: string;
  /** WIP limit — exceeded count renders in warning tone. */
  wipLimit: number;
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onChange?: (columns: KanbanColumn[]) => void;
  className?: string;
}


/**
 * KanbanBoard — columns with WIP limits, card move left/right,
 * add-card inputs and deletion. No drag library: explicit
 * ← / → controls keep it dependency-free and touch-friendly.
 */
export function KanbanBoard({ columns: initial, onChange, className }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initial.map((c) => ({ ...c, cards: [...c.cards] })));
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const commit = (next: KanbanColumn[]) => {
    setColumns(next);
    onChange?.(next);
  };

  const move = (cardId: string, fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= columns.length) return;
    const next = columns.map((c) => ({ ...c, cards: [...c.cards] }));
    const [card] = next[fromIdx]!.cards.splice(next[fromIdx]!.cards.findIndex((c) => c.id === cardId), 1);
    if (!card) return;
    next[toIdx]!.cards.push(card);
    commit(next);
  };

  const addCard = (colId: string) => {
    const draft = drafts[colId]?.trim();
    if (!draft) return;
    const next = columns.map((c) =>
      c.id === colId ? { ...c, cards: [...c.cards, { id: `${colId}-${Date.now()}`, title: draft }] } : c,
    );
    setDrafts((d) => ({ ...d, [colId]: "" }));
    commit(next);
  };

  const removeCard = (colId: string, cardId: string) =>
    commit(
      columns.map((c) =>
        c.id === colId ? { ...c, cards: c.cards.filter((card) => card.id !== cardId) } : c,
      ),
    );

  return (
    <div className={cn("overflow-x-auto rounded-2xl border-0 bg-surface-50 shadow-soft", className)}>
      <div className="flex items-stretch gap-3 p-3 sm:gap-4 sm:p-4">
        {columns.map((col, colIdx) => {
          const overWip = col.cards.length > col.wipLimit;
          const color =
            colIdx === 0 ? "bg-brand-500" : colIdx === columns.length - 1 ? "bg-success-500" : "bg-surface-400";
          return (
            <div key={col.id} className="flex w-64 shrink-0 flex-col rounded-xl bg-surface-100/70 p-2.5">
              {/* Header */}
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className={cn("size-2 shrink-0 rounded-full", overWip ? "bg-warning-500" : color)} />
                  <span className="truncate text-xs font-semibold text-surface-700">{col.title}</span>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 font-mono text-xs font-semibold",
                    overWip ? "bg-warning-500/15 text-warning-500" : "bg-surface-200/70 text-surface-500",
                  )}
                  title={`WIP limit ${col.wipLimit}`}
                >
                  {col.cards.length}/{col.wipLimit}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2">
                {col.cards.map((card) => (
                  <div key={card.id} className="rounded-lg border border-surface-200 bg-surface-0 p-2.5 shadow-soft">
                    <p className="text-sm font-medium leading-snug text-surface-800">{card.title}</p>
                    {card.tag && (
                      <span
                        className={cn(
                          "mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-xs font-semibold",
                          card.tagColor === "success" && "bg-success-500/10 text-success-500",
                          card.tagColor === "warning" && "bg-warning-500/10 text-warning-500",
                          card.tagColor === "danger" && "bg-danger-500/10 text-danger-500",
                          card.tagColor === "info" && "bg-info-500/10 text-info-500",
                          (!card.tagColor || card.tagColor === "brand") &&
                            "bg-brand-100 text-brand-700",
                        )}
                      >
                        {card.tag}
                      </span>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="flex gap-0.5">
                        <MoveBtn label="Move left" disabled={colIdx === 0} onClick={() => move(card.id, colIdx, colIdx - 1)}>
                          ←
                        </MoveBtn>
                        <MoveBtn
                          label="Move right"
                          disabled={colIdx === columns.length - 1}
                          onClick={() => move(card.id, colIdx, colIdx + 1)}
                        >
                          →
                        </MoveBtn>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCard(col.id, card.id)}
                        aria-label={`Delete ${card.title}`}
                        className="text-xs font-medium text-surface-400 transition-colors hover:text-danger-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add */}
              <form
                className="mt-2 flex gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  addCard(col.id);
                }}
              >
                <input
                  value={drafts[col.id] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [col.id]: e.target.value }))}
                  placeholder="Add card…"
                  aria-label={`Add card to ${col.title}`}
                  className="h-8 w-full min-w-0 rounded-lg border border-surface-200 bg-surface-0 px-2 text-xs outline-none placeholder:text-surface-400 focus:border-brand-400"
                />
                <button
                  type="submit"
                  aria-label="Add"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-500"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5" aria-hidden="true">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MoveBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-md border-0 bg-surface-100 shadow-inset text-sm text-surface-600 transition-colors hover:bg-surface-100 disabled:opacity-30 disabled:hover:bg-surface-50"
    >
      {children}
    </button>
  );
}