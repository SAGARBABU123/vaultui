import type { ReactNode } from "react";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentEntry {
  id: string;
  name: string;
  /** npm package the component lives in. */
  package: string;
  tier: "free" | "paid";
  description: string;
  /** exported symbol(s) to import. */
  importName: string;
  /** JSX usage snippet. */
  usage: string;
  props: PropDef[];
  demo: ReactNode;
  /** Discriminant — components omit it; dashboard templates set "dashboard". */
  kind?: "component";
}

export interface ComponentGroup {
  group: string;
  items: ComponentEntry[];
}

/**
 * Dashboard template — a full-page product layout composed from Vault
 * components. RULE: build `demo` from theme tokens ONLY (bg-surface-*,
 * text-*, border-*, shadow-*, brand-*) — no raw hex colors — so every
 * registered theme (Neumorphic, Glassmorphism, Dimensional Layering,
 * Vintage Retro Film) re-skins the template automatically.
 */
export interface DashboardEntry {
  /** Tag used to route dashboards to the wide, full-page renderer. */
  kind: "dashboard";
  id: string;
  name: string;
  description: string;
  /** Packages the template composes (shown in the header chip). */
  packages: string[];
  /** The full-page composition — tokens only. */
  demo: ReactNode;
}

export interface DashboardGroup {
  group: string;
  items: DashboardEntry[];
}

/** Route descriptor for the UI Guidelines section (/docs/guidelines/:id). */
export interface GuidelineRoute {
  kind: "guideline";
  id: string;
}