import { type ReactNode } from "react";
import { useTheme } from "../theme/ThemeContext";

/** Backdrops for translucent-surface themes (glass needs something behind it). */
export const THEME_BACKDROPS: Record<string, string> = {
  glassmorphism:
    "radial-gradient(at 18% 10%, rgb(139 0 255 / 0.28), transparent 46%), radial-gradient(at 85% 12%, rgb(0 128 255 / 0.24), transparent 46%), radial-gradient(at 60% 90%, rgb(255 20 147 / 0.13), transparent 50%), linear-gradient(180deg, #161238, #0c0a24)",
};

/**
 * Theme Wall — the same demo rendered in ALL themes at once (2×2 grid).
 * Novel: no industry docs site shows a component in every theme side by side
 * live; with token-driven theming it's one line per pane.
 */
export function ThemeWall({ demo }: { demo: ReactNode }) {
  const { themes } = useTheme();
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-surface-200 bg-surface-200/70 shadow-raised sm:grid-cols-2">
      {themes.map((t) => (
        <div
          key={t.id}
          data-theme={t.id}
          className="min-h-56"
          style={THEME_BACKDROPS[t.id] ? { backgroundImage: THEME_BACKDROPS[t.id], backgroundAttachment: "fixed" } : undefined}
        >
          <div className="px-4 py-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-surface-400">
              {t.label}
            </span>
          </div>
          <div className="p-4">{demo}</div>
        </div>
      ))}
    </div>
  );
}