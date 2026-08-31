import { useEffect, useState, type ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Badge, Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { Folder } from "lucide-react";
import { LandingPage } from "./landing/LandingPage";
import { AuthPage } from "./auth/AuthPage";
import { AccessGate } from "./auth/AccessGate";
import { useAuth } from "./auth/AuthContext";
import { Sidebar } from "./docs/Sidebar";
import { ComponentShell } from "./docs/ComponentShell";
import type { ComponentEntry, DashboardEntry } from "./docs/types";
import {
  ALL_GROUPS,
  ALL_COMPONENTS,
  ALL_DASHBOARDS,
  DASHBOARDS,
  NAV_ITEMS,
  OVERVIEW,
  entryUrl,
  isDashboard,
} from "./projects/entries";
import { ProjectProvider, useProjects } from "./projects/ProjectContext";
import { ProjectsPage } from "./projects/ProjectsPage";
import { ProjectOverviewPage } from "./projects/ProjectOverviewPage";
import { ShareKitPage } from "./projects/ShareKitPage";
import { LabPage } from "./lab/LabPage";
import { OnboardingProvider } from "./onboarding/OnboardingContext";
import { DocsHeader } from "./layout/DocsHeader";

/** Component count shown in the header / overview (overview itself excluded). */
const COMPONENT_TOTAL = ALL_COMPONENTS.length - 1;

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
      <ProjectProvider>
        <OnboardingProvider>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/docs/*" element={<DocsView />} />
            <Route
              path="/projects"
              element={
                <RequireAuth>
                  <ProjectsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <RequireAuth>
                  <ProjectOverviewPage />
                </RequireAuth>
              }
            />
            <Route path="/kit/:id" element={<ShareKitPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OnboardingProvider>
      </ProjectProvider>
    </BrowserRouter>
  );
}

/** Signed-in gate for app pages — returns the visitor to where they were. */
function RequireAuth({ children }: { children: ReactElement }) {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }
  return children;
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
  const { isSignedIn } = useAuth();

  // Every browse/download entry point funnels through here: signed-out
  // visitors go to sign-in instead of being let into the vault.
  const handleBrowse = () => {
    if (!isSignedIn) {
      navigate("/sign-in", { state: { from: "/docs" } });
      return;
    }
    navigate("/docs");
  };

  return <LandingPage onBrowse={handleBrowse} />;
}

function DocsView() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isPremium } = useAuth();
  const { projects } = useProjects();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const active = resolveActive(pathname);
  // Kit URLs and unknown ids land on their canonical route.
  if (!active || pathname !== entryUrl(active)) {
    return <Navigate to={active ? entryUrl(active) : "/docs"} replace />;
  }

  // The vault (overview + docs) requires an account — signed-out visitors
  // are parked on sign-in; they return here after authenticating.
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: pathname }} replace />;
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
      <div className="flex">
        {/* Desktop sidebar — full-height rail, flush left */}
        <aside
          id="onboard-sidebar"
          className="sticky top-0 hidden h-screen w-72 shrink-0 scrollbar-hidden overflow-y-auto border-r border-surface-200 bg-surface-0/60 lg:block"
        >
          <Sidebar
            groups={ALL_GROUPS}
            dashboards={DASHBOARDS}
            activeId={active.id}
            onSelect={navigateEntry}
            search={search}
            onSearchChange={setSearch}
            summary={`${COMPONENT_TOTAL} components · 7 kits · ${ALL_DASHBOARDS.length} dashboards`}
          />
        </aside>

        {/* Right shell — header + content live inside the column, under the rail */}
        <div className="min-w-0 flex-1">
          <DocsHeader
            componentTotal={COMPONENT_TOTAL}
            dashboardTotal={ALL_DASHBOARDS.length}
            onOpenDrawer={() => setDrawerOpen(true)}
            onLogo={() => navigate("/")}
            searchValue={search}
            onSearchChange={setSearch}
          />

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
                    summary={`${COMPONENT_TOTAL} components · 7 kits · ${ALL_DASHBOARDS.length} dashboards`}
                  />
                </div>
              </div>
            </div>
          )}

          <main className="px-4 py-8 sm:px-6 lg:px-10">
          {/* Onboarding nudge — no projects yet? Getting-started with the flow. */}
          {active.id === "overview" && projects.length === 0 && (
            <div className="mx-auto mb-6 max-w-3xl">
              <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                      Getting started
                    </p>
                    <h2 className="mt-1 text-base font-semibold tracking-tight text-surface-800">
                      Your kit, in three steps
                    </h2>
                  </div>
                  <Button size="sm" onClick={() => navigate("/projects")} leadingIcon={<Folder className="size-4" />}>
                    Create a project
                  </Button>
                </div>
                <ol className="mt-4 grid gap-2 sm:grid-cols-3">
                  {[
                    ["1", "Create a project", "Name it — that's the kit you're building."],
                    ["2", "Add components", "Hit “Add to project” on anything you like in the vault."],
                    ["3", "Download your kit", "Your project page turns it into a themed zip + install command."],
                  ].map(([n, t, d]) => (
                    <li key={n} className="rounded-xl border border-surface-200/70 bg-surface-0 p-3">
                      <span className="flex size-6 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                        {n}
                      </span>
                      <p className="mt-2 text-[13px] font-semibold text-surface-800">{t}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-surface-500">{d}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
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
    </div>
  );
}

/* --------------------------------- sidebar render --------------------------------- */