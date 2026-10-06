import { useEffect, useRef, useState } from "react";
import { cn } from "@vaultui/utils";

interface TocItem {
  id: string;
  label: string;
  level: 2 | 3 | 4;
}

/**
 * Right-shell "On this page" rail for guidelines pages (xl+ screens only).
 *
 * Scans the rendered article for its h2/h3/h4 structure (h2 = section,
 * h3/h4 = sub-sections & rules), assigns anchor ids, adds scroll-margin so
 * the sticky header never covers a target, and scroll-spies the active item.
 *
 * The rail deliberately uses the whitespace the guide tells us to keep
 * (content stays constrained to a readable column) — it doesn't stretch the
 * article; it occupies the gutter alongside it.
 */
export function GuidelineToc({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  // Index headings once per article mount (route key already restarts us).
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const heads = Array.from(root.querySelectorAll<HTMLElement>("h2, h3, h4"));

    // The first h2 is the page title — not a TOC entry.
    const firstH2 = heads.find((h) => h.tagName === "H2");
    if (firstH2) firstH2.dataset.tocTitle = "true";

    const list: TocItem[] = [];
    heads.forEach((h, i) => {
      if (h.dataset.tocTitle === "true") return;
      h.style.scrollMarginTop = "96px";
      let id = h.id;
      if (!id) {
        const slug = (h.textContent ?? "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 48);
        id = `on-this-page-${i}-${slug || String(i)}`;
        h.id = id;
      }
      list.push({
        id,
        label: h.textContent?.trim() ?? "",
        level: h.tagName === "H2" ? 2 : h.tagName === "H3" ? 3 : 4,
      });
    });
    setItems(list);
  }, [containerRef]);

  // Scroll-spy: the last heading whose top is above 40% of the viewport wins.
  useEffect(() => {
    if (items.length === 0) return;
    const spy = () => {
      const marker = window.scrollY + window.innerHeight * 0.4;
      let current = "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= marker) {
          current = it.id;
        }
      }
      setActive(current);
    };
    spy();
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    return () => {
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", spy);
    };
  }, [items]);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  // A page with fewer than two scannable sections doesn't need a rail.
  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hidden pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-surface-400">
          On this page
        </p>
        <ul ref={listRef} className="space-y-0.5">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  jump(it.id);
                }}
                aria-current={active === it.id ? "true" : undefined}
                className={cn(
                  "block rounded-md px-2.5 py-1.5 text-sm leading-snug transition-colors",
                  it.level === 2
                    ? "font-medium text-surface-700"
                    : "text-surface-400",
                  it.level >= 3 && "pl-6",
                  active === it.id
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "hover:bg-surface-100 hover:text-surface-700",
                )}
              >
                <span className="line-clamp-1">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}