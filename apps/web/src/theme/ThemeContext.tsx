import { DEFAULT_THEME_ID, THEMES } from "@vaultui/tokens";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "vault-ui-theme";

/** Read the saved theme id (validated against the registry). */
export function readSavedThemeId(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

/** Set the active theme on <html> — the hook the CSS override blocks listen to. */
export function applyThemeToDom(themeId: string) {
  document.documentElement.dataset.theme = themeId;
}

interface ThemeContextValue {
  themeId: string;
  setThemeId: (id: string) => void;
  themes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(readSavedThemeId);

  useEffect(() => {
    applyThemeToDom(themeId);
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      /* private mode — theming still works for this session */
    }
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within <ThemeProvider>");
  return value;
}