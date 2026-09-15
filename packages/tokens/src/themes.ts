/**
 * Vault UI — theme registry.
 *
 * The active theme is a `data-theme` attribute on <html>; each id maps to a
 * token override block in `src/tokens.css`. Add a new theme in two steps:
 *
 *   1. push an entry here          → shows up in the Theme dropdown
 *   2. add a `html[data-theme="id"]` override block in tokens.css → applies everywhere
 */

export interface VaultTheme {
  /** Must match the `html[data-theme="..."]` selector in tokens.css. */
  id: string;
  /** Human name shown in the Theme dropdown. */
  label: string;
}

export const THEMES: VaultTheme[] = [
  { id: "neumorphic", label: "Warm Paper" },
  { id: "glassmorphism", label: "Glassmorphism" },
  { id: "dimensional-layering", label: "Dimensional Layering" },
  { id: "vintage-retro-film", label: "Vintage Retro Film" },
];

export const DEFAULT_THEME_ID = "neumorphic";