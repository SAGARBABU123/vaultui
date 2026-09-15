import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, Lock } from "lucide-react";
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
}

export function Sidebar({ groups, dashboards, guidelineGroups, activeId, onSelect, onSelectGuideline, activeGuidelineId = "", search }: SidebarProps) {
  const { isSignedIn, isPremium } = useAuth();
  const q = search.trim().toLowerCase();

  /** Collapsed section names; search always expands everything. */
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleSection = (name: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const isCollapsed = (name: string) => (q !== "" ? false : collapsed.has(name));

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

  // Dashboard templates get the same search behaviour.
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

  return (
    <nav aria-label="Components">
      {/* Rail brand — click to return to the landing page */}
      <Link
        to="/"
        title="Back to the landing page"
        className="flex items-center gap-2.5 border-b border-surface-200/70 px-3 pb-3 pt-4 transition-colors hover:bg-surface-100/60"
      >
        <VaultLogo size={32} />
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold leading-tight tracking-tight text-surface-900">
            Vault&nbsp;UI
          </span>
          <NpmMetaPill />
        </span>
      </Link>

      {/* UI Guidelines — the do/don't playbook. Distinct namespace so its ids
          never collide with kit entries (tabs, modals, overview…). */}
      {guidelineGroups && guidelineGroups.length > 0 && (
        <div className="border-b border-surface-200/70 pb-3 pt-2">
          <div className="mb-1 flex items-center gap-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
            <BookOpen className="size-3.5" />
            Guidelines
          </div>
          {guidelineGroups.map((group) => {
            const groupCollapsed = isCollapsed(group.title);
            return (
              <div key={group.title} className="mt-0.5">
                <button
                  type="button"
                  onClick={() => toggleSection(group.title)}
                  aria-expanded={!groupCollapsed}
                  className="mb-0.5 flex w-full items-center justify-between rounded-lg px-2 py-1 text-left transition-colors hover:bg-surface-100"
                >
                  <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                    <ChevronDown
                      className={cn("size-3.5 text-surface-400 transition-transform duration-200", groupCollapsed && "-rotate-90")}
                    />
                    {group.title}
                  </span>
                </button>
                {!groupCollapsed && (
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = item.id === activeGuidelineId;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => onSelectGuideline?.(item.id)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                              active
                                ? "bg-brand-50 font-medium text-brand-700"
                                : "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
                            )}
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
          })}
        </div>
      )}

      {/* Dashboard templates section */}
      {(() => {
        const dashCount = filteredDashboards.reduce((n, g) => n + g.items.length, 0);
        const dashCollapsed = isCollapsed("Dashboard Templates");
        return dashCount > 0 || q === "" ? (
          <div>
            <button
              type="button"
              onClick={() => toggleSection("Dashboard Templates")}
              aria-expanded={!dashCollapsed}
              className="mb-1.5 flex w-full items-center justify-between rounded-lg px-2 py-1 text-left transition-colors hover:bg-surface-100"
            >
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                <ChevronDown
                  className={cn("size-3.5 text-surface-400 transition-transform duration-200", dashCollapsed && "-rotate-90")}
                />
                Dashboard Templates
              </span>
              <span className="font-mono text-[11px] text-surface-400">{dashCount}</span>
            </button>
            {!dashCollapsed && (
              dashCount > 0 ? (
                <ul className="space-y-0.5">
                  {filteredDashboards.map((group) =>
                    group.items.map((item) => {
                      const active = item.id === activeId;
                      return (
                        <li key={item.id}>
                          <Link
                            to={entryTo(item)}
                            onClick={() => onSelect(item.id)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                              active
                                ? "bg-gradient-to-r from-brand-50 to-brand-100/60 font-medium text-brand-700"
                                : "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
                            )}
                          >
                            <span className="truncate">{item.name}</span>
                            <span
                              className={cn(
                                "shrink-0 rounded px-1 py-0.5 font-mono text-[10px]",
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
              ) : (
                <p className="px-2.5 pb-1 text-xs italic leading-relaxed text-surface-400">
                  Coming soon — each template ships token-driven, so all 4 themes apply.
                </p>
              )
            )}
          </div>
        ) : null;
      })()}

      {/* Groups */}
      <div className="space-y-5 px-3 pb-6 pt-2">
        {filtered.map((group) => {
          const groupCollapsed = isCollapsed(group.group);
          return (
            <div key={group.group}>
              <button
                type="button"
                onClick={() => toggleSection(group.group)}
                aria-expanded={!groupCollapsed}
                className="mb-1.5 flex w-full items-center justify-between rounded-lg px-2 py-1 text-left transition-colors hover:bg-surface-100"
              >
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                  <ChevronDown
                    className={cn("size-3.5 text-surface-400 transition-transform duration-200", groupCollapsed && "-rotate-90")}
                  />
                  {group.group}
                </span>
                <span className="font-mono text-[11px] text-surface-400">{group.items.length}</span>
              </button>
              {!groupCollapsed && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <li key={item.id}>
                        <Link
                          to={entryTo(item)}
                          onClick={() => onSelect(item.id)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                            active
                              ? "bg-gradient-to-r from-brand-50 to-brand-100/60 font-medium text-brand-700"
                              : "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
                          )}
                        >
                          <span className="truncate">{item.name}</span>
                          <span
                            className={cn(
                              "shrink-0 rounded px-1 py-0.5 font-mono text-[10px]",
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
        })}
        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-surface-400">No components match “{search}”.</p>
        )}
      </div>
    </nav>
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
    <span className="mt-0.5 inline-block rounded-full bg-brand-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-brand-700">
      v{meta.version ?? "0.1.1"}
      {meta.downloads ? ` · ${meta.downloads} dls/mo` : ""}
    </span>
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