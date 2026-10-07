import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@vaultui/utils";
import { Kbd } from "@vaultui/ui";
import { useFocusTrap } from "../components/useFocusTrap";
import { INSTALL_COMMAND } from "../projects/counts";
import { useTheme } from "../theme/ThemeContext";
import { buildNavEntries } from "./navigation";
import { readRecents } from "./recents";
import { readFavorites } from "./favorites";

/**
 * ⌘K command palette — one place to jump anywhere and run the few common
 * actions. Fuzzy search across components, dashboards and guidelines, grouped
 * by category, with a "Recent" group and keyboard-first navigation.
 */

interface Result {
  key: string;
  label: string;
  /** Secondary text (kit name / category / "Action"). */
  hint: string;
  category: "components" | "dashboards" | "guidelines" | "actions";
  run: () => void;
  /** Present for navigable entries — lets "Recent" resolve back to a result. */
  navId?: string;
}

type Category = Result["category"];

/**
 * Subsequence fuzzy match. Returns a relevance score (lower is better);
 * `match: false` when the query's characters don't appear in order.
 */
function fuzzy(text: string, query: string): { match: boolean; score: number } {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (!q) return { match: true, score: 0 };
  let ti = 0;
  let score = 0;
  let streak = 0;
  for (let i = 0; i < q.length; i++) {
    const found = t.indexOf(q[i]!, ti);
    if (found === -1) return { match: false, score: 0 };
    streak = found === ti ? streak + 1 : 0;
    score += found - ti + (streak > 0 ? 0 : 2);
    ti = found + 1;
  }
  if (t.startsWith(q)) score -= 6;
  else if (t.includes(q)) score -= 3;
  return { match: true, score };
}

function scoreOf(result: Result, query: string): number | null {
  const label = fuzzy(result.label, query);
  const hint = fuzzy(result.hint, query);
  if (!label.match && !hint.match) return null;
  return Math.min(label.match ? label.score : Infinity, hint.match ? hint.score + 5 : Infinity);
}

const GROUP_LABELS: Record<Category, string> = {
  components: "Components",
  dashboards: "Dashboards",
  guidelines: "Guidelines",
  actions: "Actions",
};

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
  onNavigateGuideline,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (id: string) => void;
  onNavigateGuideline?: (id: string) => void;
}) {
  const { themes, themeId, setThemeId } = useTheme();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  // Read personal shortcuts each time the palette opens (any open path).
  const recents = useMemo(() => (open ? readRecents() : []), [open]);
  const pinned = useMemo(() => (open ? readFavorites() : []), [open]);

  // Every navigable entry (components + dashboards) and every guideline.
  const navItems = useMemo<Result[]>(
    () =>
      buildNavEntries().map((e) => ({
        key: e.key,
        label: e.name,
        hint: e.group,
        category: e.category,
        navId: e.navId,
        run: () => (e.category === "guidelines" ? onNavigateGuideline?.(e.id) : onNavigate(e.id)),
      })),
    [onNavigate, onNavigateGuideline],
  );

  const actionItems = useMemo<Result[]>(() => {
    const i = themes.findIndex((t) => t.id === themeId);
    const nextTheme = themes[(i + 1) % themes.length] ?? themes[0]!;
    return [
      {
        key: "a:theme",
        label: `Switch theme → ${nextTheme.label}`,
        hint: "Action",
        category: "actions",
        run: () => setThemeId(nextTheme.id),
      },
      {
        key: "a:download",
        label: "Download the kit (.zip)",
        hint: "Action",
        category: "actions",
        run: () => {
          void import("./downloadKit").then((m) => m.downloadKit());
        },
      },
      {
        key: "a:install",
        label: "Copy install command",
        hint: "Action",
        category: "actions",
        run: () => {
          void navigator.clipboard?.writeText(INSTALL_COMMAND);
        },
      },
    ];
  }, [themes, themeId, setThemeId]);

  const reset = () => {
    setQ("");
    setIdx(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const next = !open;
        onOpenChange(next);
        if (next) reset();
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Keep keyboard focus inside the palette; restore it when it closes. The
  // search input autofocuses itself, so skip the trap's initial focus pass.
  useFocusTrap(dialogRef, open, () => onOpenChange(false), { autoFocus: false });

  const query = q.trim();

  const sections = useMemo(() => {
    const out: { title: string; items: Result[] }[] = [];

    const resolve = (ids: string[]) =>
      ids
        .map((id) => navItems.find((r) => r.navId === id || r.navId === `guideline:${id}`))
        .filter((r): r is Result => Boolean(r));

    if (!query) {
      const recent = resolve(recents);
      const pins = resolve(pinned).filter((r) => !recent.some((x) => x.key === r.key));
      if (recent.length) out.push({ title: "Recent", items: recent });
      if (pins.length) out.push({ title: "Pinned", items: pins });
      out.push({ title: "Actions", items: actionItems });
      return out;
    }

    const matched = [...navItems, ...actionItems]
      .map((r) => ({ r, s: scoreOf(r, query) }))
      .filter((x): x is { r: Result; s: number } => x.s !== null)
      .sort((a, b) => a.s - b.s);

    const byCategory: Partial<Record<Category, Result[]>> = {};
    for (const { r } of matched) (byCategory[r.category] ??= []).push(r);

    (["components", "dashboards", "guidelines", "actions"] as Category[]).forEach((cat) => {
      const items = byCategory[cat];
      if (items?.length) out.push({ title: GROUP_LABELS[cat], items });
    });
    return out;
  }, [query, recents, pinned, navItems, actionItems]);

  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const cursor = flat.length ? Math.min(idx, flat.length - 1) : 0;

  // Keep the highlighted row visible while arrowing through long lists.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>("[data-focused=\"true\"]")
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor, sections]);

  const pick = (result: Result | undefined) => {
    if (!result) return;
    result.run();
    onOpenChange(false);
  };

  if (!open) return null;

  let renderIndex = -1;

  return (
    <div className="fixed inset-0 z-[85] flex items-start justify-center p-4 pt-24">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-surface-950/40 backdrop-blur-[2px]"
      />
      <div ref={dialogRef} className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-raised animate-rise">
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
                setIdx((i) => Math.min(i + 1, Math.max(0, flat.length - 1)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                pick(flat[cursor]);
              }
            }}
            placeholder="Search components, dashboards, guidelines or run a command…"
            className="w-full bg-transparent text-sm text-surface-800 outline-none placeholder:text-surface-400"
            role="combobox"
            aria-expanded="true"
            aria-label="Search"
          />
          <Kbd>esc</Kbd>
        </div>

        <ul ref={listRef} className="max-h-96 overflow-y-auto p-2" role="listbox">
          {flat.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-surface-400">Nothing matches “{q}”.</li>
          )}
          {sections.map((section) => (
            <li key={section.title} role="presentation">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                {section.title}
              </p>
              <ul role="presentation">
                {section.items.map((r) => {
                  renderIndex += 1;
                  const focused = renderIndex === cursor;
                  return (
                    <li key={r.key} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={focused}
                        data-focused={focused}
                        onMouseEnter={() => setIdx(renderIndex)}
                        onClick={() => pick(r)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                          focused ? "bg-surface-100" : "",
                        )}
                      >
                        <span className="truncate text-sm font-medium text-surface-800">{r.label}</span>
                        <span className="shrink-0 truncate font-mono text-xs text-surface-400">{r.hint}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
          {query === "" && recents.length === 0 && (
            <li className="px-3 py-2 text-center text-xs text-surface-400">
              Type to search {navItems.length} components, dashboards &amp; guidelines.
            </li>
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-surface-100 px-4 py-2 text-[11px] text-surface-400">
          <span className="flex items-center gap-2">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to navigate
          </span>
          <span className="flex items-center gap-2">
            <Kbd>↵</Kbd> to select · <Kbd>esc</Kbd> to close
          </span>
        </div>
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
