import { useEffect, useRef, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Bot,
  Boxes,
  ChevronDown,
  ClipboardCheck,
  FolderKanban,
  LayoutGrid,
  Layers,
  ListChecks,
  Lock,
  Megaphone,
  Package,
  Palette,
  Puzzle,
  Rocket,
  Search,
  ShoppingCart,
  Sparkles,
  Terminal,
  Type,
  Users,
  X,
} from "lucide-react";
import { cn } from "@vaultui/utils";
import { useAuth } from "../auth/AuthContext";
import { VaultLogo } from "../brand/VaultLogo";
import type { GuidelineGroup } from "./guidelines";
import type { ComponentEntry, ComponentGroup, DashboardEntry, DashboardGroup } from "./types";

/** Canonical URL for a sidebar entry (mirrors App.entryUrl). */
function entryTo(item: ComponentEntry | DashboardEntry): string {
  if (item.id === "overview") return "/docs";
  return item.kind === "dashboard" ? `/docs/dashboards/${item.id}` : `/docs/components/${item.id}`;
}

type IconType = ComponentType<{ className?: string }>;

/** One lucide glyph per kit/group so each sidebar section reads at a glance. */
const GROUP_ICONS: Record<string, IconType> = {
  Start: Rocket,
  "Free tier": Package,
  "AI Agent Kit": Bot,
  "Collab Kit": Users,
  "Commerce Kit": ShoppingCart,
  "Data Viz Pro": BarChart3,
  "Dev Tools Kit": Terminal,
  "Marketing Kit": Megaphone,
  "Project Kit": FolderKanban,
  "Project Mgmt Kit": ListChecks,
};

/** Matching icons for the UI-Guidelines groups. */
const GUIDELINE_ICONS: Record<string, IconType> = {
  Introduction: BookOpen,
  "Layout & Hierarchy": LayoutGrid,
  Typography: Type,
  "Color & Depth": Palette,
  Components: Boxes,
  "Advanced Components": Layers,
  "Specialized Patterns": Puzzle,
  "Polish & Feedback": Sparkles,
  "Review & Tools": ClipboardCheck,
};

/* ------------------------------- rail tabs -------------------------------- */

type RailTab = "components" | "dashboards" | "guidelines";

const TABS: { id: RailTab; label: string }[] = [
  { id: "components", label: "Components" },
  { id: "dashboards", label: "Dashboards" },
  { id: "guidelines", label: "Guidelines" },
];

const TAB_KEY = "vaultui.rail.tab.v1";
const COLLAPSE_KEY = "vaultui.rail.collapsed.v1";

/** Row styling shared by component/dashboard links and guideline buttons. */
const rowClass = (active: boolean) =>
  cn(
    "flex w-full items-center justify-between gap-2 rounded-lg py-2 pl-9 pr-2.5 text-left text-sm transition-colors",
    active
      ? "bg-gradient-to-r from-brand-50 to-brand-100/60 font-medium text-brand-700"
      : "text-surface-700 hover:bg-surface-100 hover:text-surface-900",
  );

/**
 * One collapsible sidebar section header: [icon] label … count [chevron].
 * Icons sit in a fixed-width box and the label owns the flexible middle, so
 * every section lines up on the same left edge (no text hugging the corners).
 */
function SectionHeader({
  icon: Icon,
  label,
  count,
  collapsed,
  onToggle,
  accent = false,
}: {
  icon: IconType;
  label: string;
  count?: number;
  collapsed: boolean;
  onToggle: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      className="group mb-1.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-surface-100"
    >
      <Icon
        aria-hidden="true"
        className={cn("size-4 shrink-0", accent ? "text-brand-600" : "text-surface-500")}
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-xs font-bold uppercase tracking-wider",
          accent ? "text-brand-700" : "text-surface-600",
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="shrink-0 font-mono text-xs tabular-nums text-surface-500">{count}</span>
      )}
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 text-surface-400 transition-transform duration-200",
          collapsed && "-rotate-90",
        )}
      />
    </button>
  );
}

export interface SidebarProps {
  groups: ComponentGroup[];
  dashboards: DashboardGroup[];
  /** UI Guidelines — ids deliberately namespaced to /docs/guidelines/:id. */
  guidelineGroups?: GuidelineGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Guidelines use the same ids as some kit entries (tabs, modals…) — they
   *  MUST route through their own url, never the component spine. */
  onSelectGuideline?: (id: string) => void;
  /** Active guideline id — kept separate from `activeId` so component entries
   *  and guideline entries that share an id (e.g. "overview") never both
   *  highlight. */
  activeGuidelineId?: string;
  search: string;
  onSearchChange: (value: string) => void;
  /** Opens the full ⌘K command palette (cross-category search + actions). */
  onOpenPalette?: () => void;
}

export function Sidebar({
  groups,
  dashboards,
  guidelineGroups,
  activeId,
  onSelect,
  onSelectGuideline,
  activeGuidelineId = "",
  search,
  onSearchChange,
  onOpenPalette,
}: SidebarProps) {
  const { isSignedIn, isPremium } = useAuth();
  const q = search.trim().toLowerCase();

  /* ------------------------------- rail state ----------------------------- */

  // Which of the three top-level modes the rail shows. Deep links win; a
  // manual tab choice survives until the next navigation.
  const [tab, setTab] = useState<RailTab>(() => {
    try {
      const saved = localStorage.getItem(TAB_KEY);
      if (saved === "components" || saved === "dashboards" || saved === "guidelines") return saved;
    } catch {
      /* storage unavailable */
    }
    return "components";
  });

  // Collapsed section names, persisted across visits. Search expands everything.
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(COLLAPSE_KEY);
      if (raw) return new Set<string>(JSON.parse(raw) as string[]);
    } catch {
      /* storage unavailable */
    }
    return new Set<string>();
  });

  const activeIsDashboard = dashboards.some((g) => g.items.some((i) => i.id === activeId));

  // Follow the route: land on the tab that owns the current entry. This is a
  // deliberate sync to router state (not an external store), so the
  // set-state-in-effect guard doesn't apply here.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (activeGuidelineId) setTab("guidelines");
    else if (activeIsDashboard) setTab("dashboards");
    else if (activeId) setTab("components");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [activeId, activeGuidelineId, activeIsDashboard]);

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, tab);
    } catch {
      /* storage unavailable */
    }
  }, [tab]);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...collapsed]));
    } catch {
      /* storage unavailable */
    }
  }, [collapsed]);

  // Keep the active row visible when arriving via a deep link or the palette.
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    (activeLinkRef.current ?? activeBtnRef.current)?.scrollIntoView({ block: "nearest" });
  }, [activeId, activeGuidelineId, tab, q]);

  const toggleSection = (name: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const isCollapsed = (name: string) => (q !== "" ? false : collapsed.has(name));

  /* ------------------------------- filtering ------------------------------ */

  const filtered = q
    ? groups
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
          ),
        }))
        .filter((g) => g.items.length > 0)
    : groups;

  const filteredDashboards = q
    ? dashboards
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
          ),
        }))
        .filter((g) => g.items.length > 0)
    : dashboards;

  const allGuidelineGroups = guidelineGroups ?? [];
  const filteredGuidelines = q
    ? allGuidelineGroups
        .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0)
    : allGuidelineGroups;

  const counts = {
    components: groups.reduce((n, g) => n + g.items.length, 0),
    dashboards: dashboards.reduce((n, g) => n + g.items.length, 0),
    guidelines: allGuidelineGroups.reduce((n, g) => n + g.items.length, 0),
  };
  const resultCount =
    filtered.reduce((n, g) => n + g.items.length, 0) +
    filteredDashboards.reduce((n, g) => n + g.items.length, 0) +
    filteredGuidelines.reduce((n, g) => n + g.items.length, 0);

  /* -------------------------------- renderers ----------------------------- */

  const componentSections = filtered.map((group) => {
    const groupCollapsed = isCollapsed(group.group);
    return (
      <div key={group.group}>
        <SectionHeader
          icon={GROUP_ICONS[group.group] ?? Package}
          label={group.group}
          count={group.items.length}
          collapsed={groupCollapsed}
          onToggle={() => toggleSection(group.group)}
        />
        {!groupCollapsed && (
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id}>
                  <Link
                    to={entryTo(item)}
                    ref={active ? activeLinkRef : undefined}
                    onClick={() => onSelect(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={rowClass(active)}
                  >
                    <span className="truncate">{item.name}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded px-1 py-0.5 font-mono text-xs",
                        item.tier === "free"
                          ? active
                            ? "bg-brand-100 text-brand-700"
                            : "bg-success-500/10 text-success-500"
                          : active
                            ? "bg-brand-100 text-brand-700"
                            : "bg-surface-100 text-surface-400",
                      )}
                    >
                      {item.tier === "free" ? "free" : isPremium ? "$" : <Lock className="size-3" />}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  });

  const dashboardList = (
    <ul className="space-y-0.5">
      {filteredDashboards.flatMap((group) =>
        group.items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <Link
                to={entryTo(item)}
                ref={active ? activeLinkRef : undefined}
                onClick={() => onSelect(item.id)}
                aria-current={active ? "page" : undefined}
                className={rowClass(active)}
              >
                <span className="truncate">{item.name}</span>
                <span
                  className={cn(
                    "shrink-0 rounded px-1 py-0.5 font-mono text-xs",
                    active ? "bg-brand-100 text-brand-700" : "bg-surface-100 text-surface-400",
                  )}
                >
                  {isSignedIn ? "tmpl" : <Lock className="size-3" />}
                </span>
              </Link>
            </li>
          );
        }),
      )}
    </ul>
  );

  const guidelineSections = filteredGuidelines.map((group) => {
    const groupCollapsed = isCollapsed(group.title);
    return (
      <div key={group.title} className="mt-0.5">
        <SectionHeader
          icon={GUIDELINE_ICONS[group.title] ?? BookOpen}
          label={group.title}
          collapsed={groupCollapsed}
          onToggle={() => toggleSection(group.title)}
        />
        {!groupCollapsed && (
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.id === activeGuidelineId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    ref={active ? activeBtnRef : undefined}
                    onClick={() => onSelectGuideline?.(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={rowClass(active)}
                  >
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  });

  return (
    <nav aria-label="Documentation">
      {/* Pinned top block — brand, search, and the 3-mode switch. Stays put
          while the long hierarchy scrolls beneath it. */}
      <div className="sticky top-0 z-20 border-b border-surface-200/70 bg-surface-50/95 backdrop-blur">
        {/* Rail brand — click to return to the landing page */}
        <Link
          to="/"
          title="Back to the landing page"
          className="flex items-center gap-2.5 px-3 pb-2 pt-3 transition-colors hover:bg-surface-100/60"
        >
          <VaultLogo size={32} />
          <span className="min-w-0">
            <span className="block text-base font-semibold leading-tight tracking-tight text-surface-900">
              Vault&nbsp;UI
            </span>
            <NpmMetaPill />
          </span>
        </Link>

        {/* Search — always reachable without scrolling the tree */}
        <div className="px-3 pb-2">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-surface-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search components, kits…"
              aria-label="Search the docs"
              className="h-9 w-full rounded-lg border border-surface-200 bg-surface-0 pl-8 pr-8 text-sm text-surface-800 shadow-inset outline-none placeholder:text-surface-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-surface-400 transition-colors hover:text-surface-700"
              >
                <X className="size-3.5" />
              </button>
            ) : onOpenPalette ? (
              <button
                type="button"
                onClick={onOpenPalette}
                title="Open command palette (⌘K)"
                aria-label="Open command palette"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-surface-200 bg-surface-50 px-1 font-mono text-[10px] leading-5 text-surface-400 transition-colors hover:text-surface-700"
              >
                ⌘K
              </button>
            ) : null}
          </label>
        </div>

        {/* 3-mode switch — hides while searching so results span all modes */}
        {q === "" && (
          <div role="tablist" aria-label="Docs sections" className="mx-3 mb-2 flex gap-0.5 rounded-xl bg-surface-100 p-0.5">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-center gap-1 rounded-[10px] px-1.5 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "bg-surface-0 text-brand-700 shadow-soft"
                      : "text-surface-600 hover:text-surface-900",
                  )}
                >
                  <span className="truncate">{t.label}</span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[10px] tabular-nums",
                      active ? "text-brand-500" : "text-surface-400",
                    )}
                  >
                    {counts[t.id]}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-3 pb-6 pt-3">
        {q !== "" ? (
          resultCount === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-surface-400">No results for “{search}”.</p>
          ) : (
            <div className="space-y-5">
              {filtered.length > 0 && (
                <>
                  <CategoryLabel label="Components" count={filtered.reduce((n, g) => n + g.items.length, 0)} />
                  {componentSections}
                </>
              )}
              {filteredDashboards.length > 0 && (
                <>
                  <CategoryLabel label="Dashboards" count={filteredDashboards.reduce((n, g) => n + g.items.length, 0)} />
                  <div>{dashboardList}</div>
                </>
              )}
              {filteredGuidelines.length > 0 && (
                <>
                  <CategoryLabel label="Guidelines" count={filteredGuidelines.reduce((n, g) => n + g.items.length, 0)} />
                  {guidelineSections}
                </>
              )}
            </div>
          )
        ) : tab === "components" ? (
          <div className="space-y-5">{componentSections}</div>
        ) : tab === "dashboards" ? (
          <div>
            <p className="mb-1.5 px-2.5 text-xs text-surface-400">
              Full-page templates composed from the kit.
            </p>
            {dashboardList}
          </div>
        ) : (
          <div className="space-y-1">{guidelineSections}</div>
        )}
      </div>
    </nav>
  );
}

function CategoryLabel({ label, count }: { label: string; count: number }) {
  return (
    <p className="flex items-center gap-2 px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
      {label}
      <span className="font-mono text-[10px] tabular-nums text-surface-300">{count}</span>
    </p>
  );
}

function NpmMetaPill() {
  const [meta, setMeta] = useState<{ version?: string; downloads?: string }>({});

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("https://registry.npmjs.org/@vaultui/ui/latest").then((r) => (r.ok ? r.json() : null)),
      fetch("https://api.npmjs.org/downloads/point/last-month/@vaultui/ui").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([pkg, dl]) => {
        if (!alive) return;
        setMeta({
          version: pkg?.version,
          downloads: dl?.downloads !== undefined ? `${(dl.downloads / 1000).toFixed(1)}k` : undefined,
        });
      })
      .catch(() => {
        /* offline — keep local fallback */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <span className="mt-0.5 inline-block rounded-full bg-brand-100 px-1.5 py-0.5 font-mono text-xs font-medium text-brand-700">
      v{meta.version ?? "0.1.1"}
      {meta.downloads ? ` · ${meta.downloads} dls/mo` : ""}
    </span>
  );
}
