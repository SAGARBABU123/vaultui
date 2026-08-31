import { COMPONENT_GROUPS } from "../docs/registry";
import { EXTRA_GROUPS } from "../docs/registry-extra";
import { CORE_GROUPS } from "../docs/registry-core";
import { MARKETING_GROUPS } from "../docs/registry-marketing";
import { OPTION_A_GROUPS } from "../docs/registry-optionA";
import { DASHBOARDS as DASHBOARDS_REGISTRY } from "../docs/registry-dashboards";
import type { ComponentEntry, DashboardEntry } from "../docs/types";

/**
 * Single source of truth for every navigable entry (components + dashboard
 * templates), shared by the router, the sidebar, the project cart and the
 * downloader. Mirrors the merge logic that used to live in App.tsx only.
 */

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

export const ALL_GROUPS = mergeGroups(
  mergeGroups(
    mergeGroups(mergeGroups(COMPONENT_GROUPS, EXTRA_GROUPS), CORE_GROUPS),
    MARKETING_GROUPS,
  ),
  OPTION_A_GROUPS,
);
export const ALL_COMPONENTS = ALL_GROUPS.flatMap((g) => g.items);
export const DASHBOARDS = DASHBOARDS_REGISTRY;
export const ALL_DASHBOARDS = DASHBOARDS_REGISTRY.flatMap((g) => g.items);

/** Overview is the first navigable entry and lives at /docs. */
export const OVERVIEW: ComponentEntry = ALL_COMPONENTS[0]!;

/** Linear prev/next spine: components first, then dashboard templates. */
export const NAV_ITEMS: (ComponentEntry | DashboardEntry)[] = [...ALL_COMPONENTS, ...ALL_DASHBOARDS];

export function isDashboard(entry: ComponentEntry | DashboardEntry): entry is DashboardEntry {
  return entry.kind === "dashboard";
}

/** Canonical URL for an entry (overview lives at /docs). */
export function entryUrl(entry: ComponentEntry | DashboardEntry): string {
  if (entry.id === "overview") return "/docs";
  return isDashboard(entry) ? `/docs/dashboards/${entry.id}` : `/docs/components/${entry.id}`;
}

/** Entry lookup by id — the registry map the project cart resolves against. */
export const ENTRY_BY_ID = new Map<string, ComponentEntry | DashboardEntry>();
for (const e of [...ALL_COMPONENTS, ...ALL_DASHBOARDS]) ENTRY_BY_ID.set(e.id, e);

export function entryById(id: string): ComponentEntry | DashboardEntry | null {
  return ENTRY_BY_ID.get(id) ?? null;
}

/** Group (kit) name that owns an entry — used to group cart items. */
export const GROUP_NAME_BY_ID = new Map<string, string>();
for (const g of ALL_GROUPS) for (const item of g.items) GROUP_NAME_BY_ID.set(item.id, g.group);
for (const g of DASHBOARDS_REGISTRY) for (const item of g.items) GROUP_NAME_BY_ID.set(item.id, g.group);