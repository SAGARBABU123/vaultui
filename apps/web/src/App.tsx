import { lazy, Suspense, useEffect, type ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LandingPage } from "./landing/LandingPage";
import { AuthPage } from "./auth/AuthPage";
import { useAuth } from "./auth/AuthContext";
import { ProjectProvider } from "./projects/ProjectContext";
import { OnboardingProvider } from "./onboarding/OnboardingContext";

/**
 * Route-level code splitting: landing + auth stay in the initial bundle
 * (first paint / sign-in gate); the docs vault and workspace pages load
 * on demand so the landing page ships much less JavaScript.
 */
const DocsView = lazy(() => import("./docs/DocsView").then((m) => ({ default: m.DocsView })));
const ProjectsPage = lazy(() => import("./projects/ProjectsPage").then((m) => ({ default: m.ProjectsPage })));
const ProjectOverviewPage = lazy(() =>
  import("./projects/ProjectOverviewPage").then((m) => ({ default: m.ProjectOverviewPage })),
);
const ShareKitPage = lazy(() => import("./projects/ShareKitPage").then((m) => ({ default: m.ShareKitPage })));
const LabPage = lazy(() => import("./lab/LabPage").then((m) => ({ default: m.LabPage })));
const ComposerPage = lazy(() => import("./composer/ComposerPage").then((m) => ({ default: m.ComposerPage })));

/* --------------------------------- router -------------------------------- */

export default function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <OnboardingProvider>
          <ScrollManager />
          <Suspense fallback={null}>
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
              <Route path="/composer" element={<ComposerPage />} />
              <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
              <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
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