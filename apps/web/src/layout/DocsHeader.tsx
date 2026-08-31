import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { CircleHelp, Folder } from "lucide-react";
import { ThemeDropdown } from "../components/ThemeDropdown";
import { AuthControl } from "../auth/AuthControl";
import { useAuth } from "../auth/AuthContext";
import { useProjects } from "../projects/ProjectContext";
import { useOnboarding } from "../onboarding/OnboardingContext";

/**
 * Shared app header (docs + project pages). Lives in its own module so the
 * project pages and App don't form an import cycle.
 */

const REPO_URL = "https://github.com/SAGARBABU123/vaultui";

function useNpmMeta() {
  const [meta, setMeta] = useState<{ version?: string; downloads?: string }>({});

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("https://registry.npmjs.org/@vaultui/ui/latest").then((r) => (r.ok ? r.json() : null)),
      fetch("https://api.npmjs.org/downloads/point/last-month/@vaultui/ui").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([pkg, dl]) => {
        if (!alive) return;
        setMeta({
          version: pkg?.version,
          downloads: dl?.downloads !== undefined ? `${(dl.downloads / 1000).toFixed(1)}k` : undefined,
        });
      })
      .catch(() => {
        /* offline — keep local fallback */
      });
    return () => {
      alive = false;
    };
  }, []);

  return meta;
}

export function DocsHeader({
  componentTotal,
  dashboardTotal,
  onOpenDrawer,
  onLogo,
}: {
  componentTotal: number;
  dashboardTotal: number;
  onOpenDrawer: () => void;
  onLogo: () => void;
}) {
  const { version, downloads } = useNpmMeta();
  const { isSignedIn } = useAuth();
  const { activeProject } = useProjects();
  const { startTour } = useOnboarding();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-surface-0/80 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onLogo} className="flex items-center gap-2 text-left font-semibold" title="Back to the landing page">
          <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm text-white">
            V
          </span>
          <span>
            Vault&nbsp;UI
            <span className="ml-2 hidden rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 sm:inline-block">
              v{version ?? "0.1.1"}
              {downloads ? ` · ${downloads} dl${downloads === "1.0k" ? "" : "s"}/mo` : ""}
            </span>
          </span>
        </button>

        <Badge variant="neutral" size="sm" className="hidden md:inline-flex">
          {componentTotal} components · 6 kits
          {dashboardTotal > 0 ? ` · ${dashboardTotal} dashboard template${dashboardTotal === 1 ? "" : "s"}` : ""}
        </Badge>

        <div className="flex items-center gap-2">
          {/* Mobile sidebar trigger */}
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open components list"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-lg text-surface-600 transition-colors hover:bg-surface-100 lg:hidden",
            )}
          >
            <MenuIcon />
          </button>
          {/* App controls — themes & GitHub are post-sign-in */}
          {isSignedIn && (
            <>
              {/* Take the tour — restarts the first-time guide on demand */}
              <button
                type="button"
                onClick={startTour}
                aria-label="Show the guide"
                title="Show the guide"
                className="hidden size-10 items-center justify-center rounded-xl border-0 bg-surface-0 text-surface-600 shadow-soft transition-all hover:text-surface-900 active:shadow-pressed sm:inline-flex"
              >
                <CircleHelp className="size-[18px]" />
              </button>
              {/* Active project — the cart's target; opens the project */}
              <button
                type="button"
                id="onboard-project-chip"
                onClick={() =>
                  activeProject ? navigate(`/projects/${activeProject.id}`) : navigate("/projects")
                }
                title={activeProject ? `Open ${activeProject.name}` : "Select or create a project"}
                className="hidden h-10 max-w-[13rem] items-center gap-1.5 rounded-xl border-0 bg-surface-0 px-3 text-sm font-medium text-surface-700 shadow-soft transition-all hover:text-surface-900 active:shadow-pressed sm:inline-flex"
              >
                <Folder className="size-4 shrink-0 text-brand-600" />
                <span className="truncate">{activeProject ? activeProject.name : "Select a project"}</span>
                {activeProject && (
                  <span className="shrink-0 rounded-full bg-brand-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-700">
                    {activeProject.items.length}
                  </span>
                )}
              </button>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vault UI on GitHub"
                className="hidden size-10 items-center justify-center rounded-xl border-0 bg-surface-0 text-surface-600 shadow-soft transition-all hover:text-surface-900 active:shadow-pressed sm:inline-flex"
              >
                <GitHubIcon className="size-[18px]" />
              </a>
              {/* Theme switcher — anchored far-right, post-sign-in only */}
              <span id="onboard-theme" className="inline-flex">
                <ThemeDropdown />
              </span>
            </>
          )}
          {/* Account — pinned to the far right, next to the theme switcher */}
          <AuthControl />
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- icons --------------------------------- */

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function GitHubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0012 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}