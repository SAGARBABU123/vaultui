import { useState } from "react";
import { Badge, Button } from "@vault/ui";
import { cn } from "@vault/utils";
import { COMPONENT_GROUPS } from "./docs/registry";
import { EXTRA_GROUPS } from "./docs/registry-extra";
import { Sidebar } from "./docs/Sidebar";
import { ComponentShell } from "./docs/ComponentShell";

/** Merge extra entries into their matching groups (Collab Kit is new). */
function mergeGroups(base: typeof COMPONENT_GROUPS, extra: typeof EXTRA_GROUPS) {
  const merged = base.map((g) => ({ ...g, items: [...g.items] }));
  for (const eg of extra) {
    const target = merged.find((g) => g.group === eg.group);
    if (target) target.items.push(...eg.items);
    else merged.push({ ...eg, items: [...eg.items] });
  }
  return merged;
}

const ALL_GROUPS = mergeGroups(COMPONENT_GROUPS, EXTRA_GROUPS);
const ALL_COMPONENTS = ALL_GROUPS.flatMap((g) => g.items);
const TOTAL = ALL_COMPONENTS.length - 1; // minus overview

export default function App() {
  const [activeId, setActiveId] = useState(ALL_COMPONENTS[0]!.id);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeIndex = ALL_COMPONENTS.findIndex((e) => e.id === activeId);
  const active = ALL_COMPONENTS[activeIndex] ?? ALL_COMPONENTS[0]!;
  const prev = ALL_COMPONENTS[activeIndex - 1] ?? null;
  const next = ALL_COMPONENTS[activeIndex + 1] ?? null;

  const navigate = (id: string) => {
    setActiveId(id);
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <Header
        total={TOTAL}
        onOpenDrawer={() => setDrawerOpen(true)}
        onHome={() => navigate("overview")}
      />

      <div className="mx-auto flex max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-surface-200 bg-surface-0/60 lg:block">
          <Sidebar groups={ALL_GROUPS} activeId={activeId} onSelect={navigate} search={search} onSearchChange={setSearch} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 w-full bg-surface-950/40 backdrop-blur-[2px]"
            />
            <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-surface-50 shadow-popover animate-rise">
              <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3">
                <span className="text-sm font-semibold">Components</span>
                <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
                  Close
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <Sidebar groups={ALL_GROUPS} activeId={activeId} onSelect={navigate} search={search} onSearchChange={setSearch} />
              </div>
            </div>
          </div>
        )}

        {/* Right shell */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <ComponentShell entry={active} prev={prev} next={next} onNavigate={navigate} />
          </div>
        </main>
      </div>
    </div>
  );
}

/* --------------------------------- header -------------------------------- */

function Header({
  total,
  onOpenDrawer,
  onHome,
}: {
  total: number;
  onOpenDrawer: () => void;
  onHome: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-surface-0/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onHome} className="flex items-center gap-2 text-left font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            V
          </span>
          <span>
            Vault&nbsp;UI
            <span className="ml-2 hidden rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 sm:inline-block">
              v0.1.0
            </span>
          </span>
        </button>

        <Badge variant="neutral" size="sm" className="hidden md:inline-flex">
          {total} components · 6 kits
        </Badge>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" leadingIcon={<GitHubIcon />}>
            GitHub
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>
          {/* Mobile sidebar trigger */}
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open components list"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-lg text-surface-600 transition-colors hover:bg-surface-100 lg:hidden",
            )}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- icons --------------------------------- */

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0012 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}