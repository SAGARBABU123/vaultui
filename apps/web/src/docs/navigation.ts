import type { ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  Bot,
  Boxes,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  ListChecks,
  Megaphone,
  Package,
  Palette,
  Puzzle,
  Rocket,
  ShoppingCart,
  Sparkles,
  Terminal,
  Type,
  Users,
} from "lucide-react";
import { GROUP_NAME_BY_ID, NAV_ITEMS, isDashboard } from "../projects/entries";
import { GUIDELINE_GROUPS, GUIDELINE_NAV } from "./guidelines";

/**
 * Single source of truth for docs navigation chrome — the rail's modes,
 * section icons, and a flat index of every navigable entry. The Sidebar and
 * the ⌘K palette both build from here, so ordering/labels/icons can't drift.
 */

export type IconType = ComponentType<{ className?: string }>;
export type RailTab = "components" | "dashboards" | "guidelines";

export const TABS: { id: RailTab; label: string }[] = [
  { id: "components", label: "Components" },
  { id: "dashboards", label: "Dashboards" },
  { id: "guidelines", label: "Guidelines" },
];

/** Icons for the collapsed icon-rail (one per mode). */
export const TAB_ICONS: Record<RailTab, IconType> = {
  components: Boxes,
  dashboards: LayoutDashboard,
  guidelines: BookOpen,
};

/** One glyph per kit/group so each rail section reads at a glance. */
export const GROUP_ICONS: Record<string, IconType> = {
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
export const GUIDELINE_ICONS: Record<string, IconType> = {
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

export interface NavEntry {
  id: string;
  name: string;
  /** Owning kit (or "Dashboard"/guideline group). */
  group: string;
  category: "components" | "dashboards" | "guidelines";
  /** Unique key across categories (guidelines are namespaced). */
  key: string;
  /** Id used for recents/pins bookkeeping. */
  navId: string;
}

/** Flat, ordered index of everything reachable from the rail or palette. */
export function buildNavEntries(): NavEntry[] {
  const entries: NavEntry[] = NAV_ITEMS.filter((e) => e.id !== "overview").map((e) => {
    const dash = isDashboard(e);
    return {
      id: e.id,
      name: e.name,
      group: GROUP_NAME_BY_ID.get(e.id) ?? (dash ? "Dashboard" : ""),
      category: dash ? "dashboards" : "components",
      key: `${dash ? "d" : "c"}:${e.id}`,
      navId: e.id,
    };
  });

  const guides: NavEntry[] = GUIDELINE_NAV.map((g) => ({
    id: g.id,
    name: g.label,
    group: GUIDELINE_GROUPS.find((grp) => grp.items.some((i) => i.id === g.id))?.title ?? "Guidelines",
    category: "guidelines",
    key: `g:${g.id}`,
    navId: `guideline:${g.id}`,
  }));

  return [...entries, ...guides];
}
