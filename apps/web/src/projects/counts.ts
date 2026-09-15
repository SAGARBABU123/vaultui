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