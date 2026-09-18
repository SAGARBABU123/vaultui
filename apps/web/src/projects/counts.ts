/**
 * Registry counts for surfaces that must NOT import the heavy registries.
 *
 * The landing page displays live-looking totals ("105 components · 5
 * dashboards") but importing `projects/entries` from it bundles the ENTIRE
 * UI kit (~2,000 modules) into the initial 800 KB+ main chunk — that's what
 * froze the site on slow machines. Instead the landing reads these
 * precomputed numbers.
 *
 * Source of truth: docs/registry*.tsx. Recompute after edits:
 *   node scripts/registry-count.mjs   (prints these values)
 */
export const COMPONENT_COUNT = 105; // ALL_COMPONENTS.length (includes `/docs` overview)
export const DASHBOARD_COUNT = 5; // ALL_DASHBOARDS.length

/** Base install line — kept here so the landing page can show it without
 *  importing the registry (downloadKit re-uses this constant). */
export const INSTALL_COMMAND = "pnpm add @vaultui/tokens @vaultui/utils @vaultui/ui";

/**
 * Industry-standard install tabs: ONE package on the npm registry, shown with
 * the command for each package manager (npm / yarn / pnpm / bun). All four
 * resolve the identical tarball from registry.npmjs.org — there is no separate
 * bun/yarn registry (bun installs are npm-compatible by design).
 */
export const PACKAGE_MANAGERS = [
  { id: "npm", label: "npm", command: "npm i @vaultui/tokens @vaultui/utils @vaultui/ui" },
  { id: "yarn", label: "yarn", command: "yarn add @vaultui/tokens @vaultui/utils @vaultui/ui" },
  { id: "pnpm", label: "pnpm", command: INSTALL_COMMAND },
  { id: "bun", label: "bun", command: "bun add @vaultui/tokens @vaultui/utils @vaultui/ui" },
] as const;

export type PackageManagerId = (typeof PACKAGE_MANAGERS)[number]["id"];