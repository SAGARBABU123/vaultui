import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
// Kit styles render only inside the docs vault — importing here keeps them out
// of the landing page css.
import "@vaultui/data-viz/dataviz.css";
import "@vaultui/marketing/marketing.css";
import { useAuth } from "../auth/AuthContext";
import { AccessGate } from "../auth/AccessGate";
import { DocsHeader } from "../layout/DocsHeader";
import { Sidebar } from "./Sidebar";
import { ComponentShell } from "./ComponentShell";
import { CommandPalette } from "./CommandPalette";
import { AskTheKit } from "./AskTheKit";
import { GuidelinesView } from "./GuidelinesView";
import {
  GUIDELINE_GROUPS,
  GUIDELINE_NAV,
  GUIDELINE_VIEWS,
  guidelineUrl,
} from "./guidelines";
import type { ComponentEntry, DashboardEntry, GuidelineRoute } from "./types";
import {
  ALL_GROUPS,
  ALL_COMPONENTS,
  ALL_DASHBOARDS,
  DASHBOARDS,
  NAV_ITEMS,
  OVERVIEW,
  entryUrl,
  isDashboard,
} from "../projects/entries";

/** Component count shown in the header / overview (overview itself excluded). */
const COMPONENT_TOTAL = ALL_COMPONENTS.length - 1;

/** "AI Agent Kit" → "ai-agent-kit" — used by the /docs/kits/:slug redirect. */
function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type ActiveDoc = ComponentEntry | DashboardEntry | GuidelineRoute;

/** Resolve a /docs pathname to an entry; null means "unknown → redirect to /docs". */
function resolveActive(pathname: string): ActiveDoc | null {
  const segs = pathname
    .slice("/docs".length)
    .split("/")
    .filter(Boolean);
  const [kind, id] = segs;
  if (!kind) return OVERVIEW;
  if (kind === "guidelines") {
    return id && GUIDELINE_VIEWS[id] ? ({ kind: "guideline", id } satisfies GuidelineRoute) : null;
  }
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

/** Canonical URL for any active doc (components, dashboards, guidelines). */
function canonicalUrl(active: ActiveDoc): string {
  return active.kind === "guideline" ? guidelineUrl(active.id) : entryUrl(active);
}

export function DocsView() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isPremium } = useAuth();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // j / k — previous / next entry while browsing docs (skip form fields).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key !== "j" && e.key !== "k") return;
      const cur = resolveActive(location.pathname);
      if (!cur) return;
      const spine = cur.kind === "guideline" ? GUIDELINE_NAV : NAV_ITEMS;
      const idx = spine.findIndex((x) => x.id === cur.id);
      const target = e.key === "j" ? spine[idx - 1] : spine[idx + 1];
      if (!target) return;
      e.preventDefault();
      navigate(
        cur.kind === "guideline"
          ? guidelineUrl(target.id)
          : entryUrl(target as ComponentEntry | DashboardEntry),
      );
      setDrawerOpen(false);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const active = resolveActive(pathname);
  // Kit URLs and unknown ids land on their canonical route.
  if (!active || pathname !== canonicalUrl(active)) {
    return <Navigate to={active ? canonicalUrl(active) : "/docs"} replace />;
  }

  // The vault (overview + docs) requires an account — signed-out visitors
  // are parked on sign-in; they return here after authenticating.
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: pathname }} replace />;
  }

  // Guidelines are educational vault content — never premium-gated.
  const isGuideline = active.kind === "guideline";

  // Auth gates: dashboards need an account; paid components need premium.
  const gate: "premium" | "dashboard" | null =
    !isGuideline && isDashboard(active)
      ? "dashboard"
      : !isGuideline && "tier" in active && active.tier === "paid"
        ? "premium"
        : null;
  const locked = gate ? (gate === "dashboard" ? !isSignedIn : !isPremium) : false;

  const activeIndex = NAV_ITEMS.findIndex((e) => e.id === active.id);
  const prev = activeIndex > 0 ? NAV_ITEMS[activeIndex - 1] ?? null : null;
  const next = activeIndex >= 0 && activeIndex < NAV_ITEMS.length - 1 ? NAV_ITEMS[activeIndex + 1] ?? null : null;

  const navigateEntry = (id: string) => {
    // Component / dashboard entries only (CommandPalette + kit sidebar).
    const e = NAV_ITEMS.find((x) => x.id === id);
    if (!e) return;
    navigate(entryUrl(e));
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  };

  // Guidelines share ids with kit entries (tabs, modals, overview…), so they
  // get their own url + handler — never route through the component spine.
  const navigateGuideline = (id: string) => {
    navigate(guidelineUrl(id));
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen text-surface-900">
      {/* Full-width app bar — the top-nav axis. Astryx `shell-nav` shape:
          a top menu bar spanning the whole frame, then a left hierarchy rail
          below it, beside the content. */}
      <DocsHeader
        componentTotal={COMPONENT_TOTAL}
        dashboardTotal={ALL_DASHBOARDS.length}
        onOpenDrawer={() => setDrawerOpen(true)}
        searchValue={search}
        onSearchChange={setSearch}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <div className="flex">
        {/* Left rail — sits under the app bar (height = 100vh − 4rem bar) */}
        <aside
          id="onboard-sidebar"
          className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 scrollbar-hidden overflow-y-auto border-r border-surface-200 bg-surface-0/60 lg:block"
        >
          <Sidebar
            groups={ALL_GROUPS}
            dashboards={DASHBOARDS}
            guidelineGroups={GUIDELINE_GROUPS}
            activeId={isGuideline ? "" : active.id}
            activeGuidelineId={isGuideline ? active.id : ""}
            onSelect={navigateEntry}
            onSelectGuideline={navigateGuideline}
            search={search}
          />
        </aside>

        {/* Content column — beside the rail, under the app bar */}
        <div className="min-w-0 flex-1">
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onNavigate={navigateEntry} />
          <AskTheKit />

          {/* Mobile drawer — stacked above the floating “Ask the kit” FAB on small screens */}
          {drawerOpen && (
            <div className="fixed inset-0 z-[90] lg:hidden">
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
                    guidelineGroups={GUIDELINE_GROUPS}
                    activeId={isGuideline ? "" : active.id}
                    activeGuidelineId={isGuideline ? active.id : ""}
                    onSelect={navigateEntry}
                    onSelectGuideline={navigateGuideline}
                    search={search}
                  />
                </div>
              </div>
            </div>
          )}

          <main className="px-4 py-8 sm:px-6 lg:px-10">
            <div
              className={cn(
                isGuideline || active.id === "overview"
                  ? "w-full"
                  : isDashboard(active)
                    ? "mx-auto max-w-6xl"
                    : "mx-auto max-w-3xl",
              )}
            >
              {isGuideline ? (
                <GuidelinesView item={GUIDELINE_NAV.find((g) => g.id === active.id)!} onNavigate={navigateGuideline} />
              ) : locked && gate ? (
                <AccessGate kind={gate} />
              ) : (
                <ComponentShell
                  entry={active}
                  prev={prev}
                  next={next}
                  onNavigate={navigateEntry}
                  onNavigateGuideline={navigateGuideline}
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