import { useState, type ReactNode } from "react";
import { cn } from "@vaultui/utils";
import { useTheme } from "../theme/ThemeContext";
import { Button } from "@vaultui/ui";

/**
 * Theme A/B diff — renders any demo twice, side by side, in two selectable
 * themes. Theme overrides in tokens.css match any `[data-theme]` element, so
 * each pane scopes its own theme variables without touching the global one.
 */

/** Backdrops for translucent-surface themes (glass needs something behind it). */
const PANE_BACKDROPS: Record<string, string> = {
  glassmorphism:
    "radial-gradient(at 18% 10%, rgb(139 0 255 / 0.28), transparent 46%), radial-gradient(at 85% 12%, rgb(0 128 255 / 0.24), transparent 46%), radial-gradient(at 60% 90%, rgb(255 20 147 / 0.13), transparent 50%), linear-gradient(180deg, #161238, #0c0a24)",
};

export function ThemeCompare({ demo, className }: { demo: ReactNode; className?: string }) {
  const { themes } = useTheme();
  const ids = themes.map((t) => t.id);
  const [left, setLeft] = useState(ids[0] ?? "neumorphic");
  const [right, setRight] = useState(ids[1] ?? ids[0] ?? "neumorphic");

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-surface-200 shadow-raised", className)}>
      <div className="grid gap-px bg-surface-200/70 md:grid-cols-2">
        {[
          { key: "left", id: left, set: setLeft },
          { key: "right", id: right, set: setRight },
        ].map(({ key, id, set }) => (
          <div
            key={key}
            data-theme={id}
            className="min-h-64"
            style={
              PANE_BACKDROPS[id]
                ? {
                    backgroundImage: PANE_BACKDROPS[id],
                    backgroundAttachment: "fixed",
                  }
                : undefined
            }
          >
            <div className="flex items-center justify-between gap-2 px-4 py-2.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-surface-400">
                {id}
              </span>
              <select
                value={id}
                onChange={(e) => set(e.target.value)}
                aria-label={`${key} theme`}
                className="h-7 cursor-pointer rounded-md border border-surface-200 bg-surface-0 px-2 font-mono text-[11px] text-surface-600 shadow-inset outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-4">{demo}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-surface-200 bg-surface-0 px-4 py-2">
        <span className="font-mono text-[11px] text-surface-400">
          Same component · two themes — live, no reload
        </span>
        <Button size="sm" variant="ghost" onClick={swap} title="Swap the themes">
          ⇄ swap
        </Button>
      </div>
    </div>
  );
}