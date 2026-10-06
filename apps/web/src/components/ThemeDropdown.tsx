import { cn } from "@vaultui/utils";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/ThemeContext";

/**
 * Theme switcher — one dropdown to rule all views (landing + docs).
 * The list comes from @vaultui/tokens' THEMES registry, so a new theme
 * appears here as soon as it's registered.
 */
export function ThemeDropdown() {
  const { themes, themeId, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = themes.find((t) => t.id === themeId) ?? themes[0]!;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose theme"
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-xl border-0 bg-surface-0 px-3 text-sm font-medium text-surface-600 shadow-soft transition-all hover:text-surface-900 active:shadow-pressed",
        )}
      >
        <Palette className="size-4" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown
          className={cn("size-3.5 text-surface-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Themes"
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-surface-200 bg-surface-0 p-1.5 shadow-popover animate-rise"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wider text-surface-500">
            Theme
          </p>
          {themes.map((t) => {
            const active = t.id === themeId;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setThemeId(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
                )}
              >
                <span className="flex items-center gap-2">
                  <Palette className={cn("size-4", active ? "text-brand-600" : "text-surface-400")} />
                  {t.label}
                </span>
                {active && <Check className="size-4 text-brand-600" strokeWidth={2.5} />}
              </button>
            );
          })}
          <p className="border-t border-surface-100 px-2.5 pb-1.5 pt-2 text-xs leading-relaxed text-surface-400">
            More themes coming soon — each re-skins every component, kit, dashboard template and the landing page.
          </p>
        </div>
      )}
    </div>
  );
}