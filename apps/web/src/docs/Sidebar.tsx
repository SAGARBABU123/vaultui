import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { cn } from "@vaultui/utils";
import { useAuth } from "../auth/AuthContext";
import type { ComponentEntry, ComponentGroup, DashboardEntry, DashboardGroup } from "./types";

/** Canonical URL for a sidebar entry (mirrors App.entryUrl). */
function entryTo(item: ComponentEntry | DashboardEntry): string {
  if (item.id === "overview") return "/docs";
  return item.kind === "dashboard" ? `/docs/dashboards/${item.id}` : `/docs/components/${item.id}`;
}

export interface SidebarProps {
  groups: ComponentGroup[];
  dashboards: DashboardGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function Sidebar({ groups, dashboards, activeId, onSelect, search, onSearchChange }: SidebarProps) {
  const { isSignedIn, isPremium } = useAuth();
  const q = search.trim().toLowerCase();
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
      {/* Search */}
      <div className="p-3 pb-1">
        <label className="relative block">
          <span className="sr-only">Search components</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter components…"
            className="h-10 w-full rounded-xl border-0 bg-surface-100 shadow-inset pl-9 pr-3 text-sm text-surface-800 outline-none placeholder:text-surface-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      </div>

      {/* Dashboard templates section */}
      {(() => {
        const dashCount = filteredDashboards.reduce((n, g) => n + g.items.length, 0);
        return dashCount > 0 || q === "" ? (
          <div>
            <div className="mb-1.5 flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                Dashboard Templates
              </span>
              <span className="font-mono text-[11px] text-surface-400">{dashCount}</span>
            </div>
            {dashCount > 0 ? (
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
            )}
          </div>
        ) : null;
      })()}

      {/* Groups */}
      <div className="space-y-5 px-3 pb-6 pt-2">
        {filtered.map((group) => (
          <div key={group.group}>
            <div className="mb-1.5 flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                {group.group}
              </span>
              <span className="font-mono text-[11px] text-surface-400">{group.items.length}</span>
            </div>
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
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-surface-400">No components match “{search}”.</p>
        )}
      </div>
    </nav>
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