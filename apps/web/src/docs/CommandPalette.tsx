import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@vaultui/utils";
import { Kbd } from "@vaultui/ui";
import { NAV_ITEMS } from "../projects/entries";

/**
 * ⌘K command palette — jump to any component or dashboard from anywhere in
 * the docs. Global Cmd/Ctrl+K listener; arrows + Enter to select; ESC closes.
 */
export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const next = !open;
        onOpenChange(next);
        if (next) {
          setQ("");
          setIdx(0);
        }
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const listRef = useRef<HTMLUListElement>(null);

  // Keep the arrow-highlighted option visible while navigating long lists.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[data-focused=\"true\"]")?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const items = NAV_ITEMS.filter((e) => e.id !== "overview");
    if (!query) return items;
    return items.filter((e) => e.name.toLowerCase().includes(query) || e.id.includes(query));
  }, [q]);

  const pick = (id: string) => {
    onNavigate(id);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-start justify-center p-4 pt-24">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-surface-950/40 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-raised animate-rise">
        <div className="flex items-center gap-2 border-b border-surface-100 px-4 py-3">
          <SearchIcon className="size-4 shrink-0 text-surface-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIdx((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[idx]) {
                e.preventDefault();
                pick(results[idx]!.id);
              }
            }}
            placeholder="Jump to a component or dashboard…"
            className="w-full bg-transparent text-sm text-surface-800 outline-none placeholder:text-surface-400"
            role="combobox"
            aria-expanded="true"
          />
          <Kbd>esc</Kbd>
        </div>
        <ul ref={listRef} className="max-h-96 overflow-y-auto p-2" role="listbox">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-surface-400">Nothing matches “{q}”.</li>
          )}
          {results.map((e, i) => (
            <li key={e.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === idx}
                data-focused={i === idx}
                onMouseEnter={() => setIdx(i)}
                onClick={() => pick(e.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                  i === idx ? "bg-surface-100" : "",
                )}
              >
                <span className="truncate text-sm font-medium text-surface-800">{e.name}</span>
                <span className="shrink-0 font-mono text-[10px] text-surface-400">
                  {e.kind === "dashboard" ? "template" : "tier" in e ? e.tier : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}