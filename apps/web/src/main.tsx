import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@vaultui/tokens/tokens.css";
import App from "./App";
import { applyThemeToDom, readSavedThemeId, ThemeProvider } from "./theme/ThemeContext";

// Apply the saved theme before first paint so there's no style flash.
applyThemeToDom(readSavedThemeId());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);