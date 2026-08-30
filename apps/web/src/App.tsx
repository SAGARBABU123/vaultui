import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Badge, Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { LandingPage } from "./landing/LandingPage";
import { ThemeDropdown } from "./components/ThemeDropdown";
import { AuthPage } from "./auth/AuthPage";
import { AccessGate } from "./auth/AccessGate";
import { AuthControl } from "./auth/AuthControl";
import { useAuth } from "./auth/AuthContext";
import { COMPONENT_GROUPS } from "./docs/registry";
import { EXTRA_GROUPS } from "./docs/registry-extra";
import { DASHBOARDS } from "./docs/registry-dashboards";
import { Sidebar } from "./docs/Sidebar";
import { ComponentShell } from "./docs/ComponentShell";
import type { ComponentEntry, DashboardEntry } from "./docs/types";

/** Merge extra entries into their matching groups (Collab Kit is new). */
function mergeGroups(base: typeof COMPONENT_GROUPS, extra: typeof EXTRA_GROUPS) {
  const merged = base.map((g) => ({ ...g, items: [...g.items] }));
  for (const eg of extra) {
    const target = merged.find((g) => g.group === eg.group);
    if (target) target.items.push(...eg.items);
    else merged.push({ ...eg, items: [...eg.items] });
  }
  return merged;
}

const ALL_GROUPS = mergeGroups(COMPONENT_GROUPS, EXTRA_GROUPS);
const ALL_COMPONENTS = ALL_GROUPS.flatMap((g) => g.items);
const ALL_DASHBOARDS = DASHBOARDS.flatMap((g) => g.items);

/** Component count shown in the header / overview (overview itself excluded). */
const COMPONENT_TOTAL = ALL_COMPONENTS.length - 1;

/** Linear prev/next spine: components first, then dashboard templates. */
const NAV_ITEMS: (ComponentEntry | DashboardEntry)[] = [...ALL_COMPONENTS, ...ALL_DASHBOARDS];

const OVERVIEW = ALL_COMPONENTS[0]!; // id "overview"

function isDashboard(entry: ComponentEntry | DashboardEntry): entry is DashboardEntry {
  return entry.kind === "dashboard";
}

/** Canonical URL for an entry (overview lives at /docs). */
function entryUrl(entry: ComponentEntry | DashboardEntry): string {
  if (entry.id === "overview") return "/docs";
  return isDashboard(entry) ? `/docs/dashboards/${entry.id}` : `/docs/components/${entry.id}`;
}

/** "AI Agent Kit" → "ai-agent-kit" — used by the /docs/kits/:slug redirect. */
function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolve a /docs pathname to an entry; null means "unknown → redirect to /docs". */
function resolveActive(pathname: string): ComponentEntry | DashboardEntry | null {
  const segs = pathname
    .slice("/docs".length)
    .split("/")
    .filter(Boolean);
  const [kind, id] = segs;
  if (!kind) return OVERVIEW;
  if (kind === "components") return ALL_COMPONENTS.find((c) => c.id === id) ?? null;
  if (kind === "dashboards") return ALL_DASHBOARDS.find((d) => d.id === id) ?? null;
  if (kind === "kits") {
    const group = ALL_GROUPS.find((g) => slugify(g.group) === id);
    if (!group) return null;
    const first = group.items.find((i) => i.id !== "overview") ?? group.items[0];
    return first ?? null;
  }
  return null;
}

/* --------------------------------- router -------------------------------- */

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/docs/*" element={<DocsView />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Scroll to top on route change — landing anchor hashes keep working. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function LandingView() {
  const navigate = useNavigate();
  return <LandingPage onBrowse={() => navigate("/docs")} />;
}

function DocsView() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isPremium } = useAuth();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const active = resolveActive(pathname);
  // Kit URLs and unknown ids land on their canonical route.
  if (!active || pathname !== entryUrl(active)) {
    return <Navigate to={active ? entryUrl(active) : "/docs"} replace />;
  }

  // Auth gates: dashboards need an account; paid components need premium.
  const gate: "premium" | "dashboard" | null = isDashboard(active)
    ? "dashboard"
    : "tier" in active && active.tier === "paid"
      ? "premium"
      : null;
  const locked = gate ? (gate === "dashboard" ? !isSignedIn : !isPremium) : false;

  const activeIndex = NAV_ITEMS.findIndex((e) => e.id === active.id);
  const prev = NAV_ITEMS[activeIndex - 1] ?? null;
  const next = NAV_ITEMS[activeIndex + 1] ?? null;

  const navigateEntry = (id: string) => {
    const e = NAV_ITEMS.find((x) => x.id === id);
    if (!e) return;
    navigate(entryUrl(e));
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen text-surface-900">
      <Header
        componentTotal={COMPONENT_TOTAL}
        dashboardTotal={ALL_DASHBOARDS.length}
        onOpenDrawer={() => setDrawerOpen(true)}
        onLogo={() => navigate("/")}
      />

      <div className="flex">
        {/* Desktop sidebar — flush to the left edge, hidden scrollbar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 scrollbar-hidden overflow-y-auto border-r border-surface-200 bg-surface-0/60 lg:block">
          <Sidebar
            groups={ALL_GROUPS}
            dashboards={DASHBOARDS}
            activeId={active.id}
            onSelect={navigateEntry}
            search={search}
            onSearchChange={setSearch}
          />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 w-full bg-surface-950/40 backdrop-blur-[2px]"
            />
            <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-surface-50 shadow-popover animate-rise">
              <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3">
                <span className="text-sm font-semibold">Browse docs</span>
                <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
                  Close
                </Button>
              </div>
              <div className="min-h-0 flex-1 scrollbar-hidden overflow-y-auto">
                <Sidebar
                  groups={ALL_GROUPS}
                  dashboards={DASHBOARDS}
                  activeId={active.id}
                  onSelect={navigateEntry}
                  search={search}
                  onSearchChange={setSearch}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right shell */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className={cn("mx-auto", isDashboard(active) ? "max-w-6xl" : "max-w-3xl")}>
            {locked && gate ? (
              <AccessGate kind={gate} />
            ) : (
              <ComponentShell
                entry={active}
                prev={prev}
                next={next}
                onNavigate={navigateEntry}
                componentTotal={COMPONENT_TOTAL}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* --------------------------------- header -------------------------------- */

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

const REPO_URL = "https://github.com/SAGARBABU123/vaultui";

function Header({
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
  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-surface-0/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onLogo} className="flex items-center gap-2 text-left font-semibold" title="Back to the landing page">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
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
          {/* Account — same slot as on the landing page */}
          <AuthControl />
          {/* App controls — themes & GitHub are post-sign-in */}
          {isSignedIn && (
            <>
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
              <ThemeDropdown />
            </>
          )}
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