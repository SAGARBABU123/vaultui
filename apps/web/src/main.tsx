import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import "./styles.css";
import "@vaultui/ui/button.css";
import "@vaultui/ui/primitives.css";
// NOTE: kit CSS (dataviz.css, marketing.css) is NOT global — it loads with the
// docs / lab chunks that actually render those components.
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { applyThemeToDom, readSavedThemeId, ThemeProvider } from "./theme/ThemeContext";

// Apply the saved theme before first paint so there's no style flash.
applyThemeToDom(readSavedThemeId());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);