/** Project item — a component or dashboard template added to a project. */

export type ProjectItemKind = "component" | "dashboard";

export interface ProjectItemMeta {
  /** Entry id from the registry ("button", "chat-canvas", "dashboard-executive", …). */
  id: string;
  kind: ProjectItemKind;
  /** Snapshot of the display name at add time. */
  name: string;
  /** npm package (components) — null for dashboard templates. */
  pkg: string | null;
  /** Packages a dashboard template composes (components: single-pkg list). */
  pkgList: string[];
  tier: "free" | "paid";
  addedAt: number;
}

export interface UserProject {
  id: string;
  name: string;
  /** Theme the exported kit should ship with (defaults to neumorphic). */
  themeId: string;
  createdAt: number;
  updatedAt: number;
  items: ProjectItemMeta[];
}