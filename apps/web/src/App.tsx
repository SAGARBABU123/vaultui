import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LandingPage } from "./landing/LandingPage";
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
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectOverviewPage />} />
              <Route path="/kit/:id" element={<ShareKitPage />} />
              <Route path="/lab" element={<LabPage />} />
              <Route path="/composer" element={<ComposerPage />} />
              {/* Auth parked — old sign-in/sign-up links land straight in the app. */}
              <Route path="/sign-in" element={<Navigate to="/docs" replace />} />
              <Route path="/sign-up" element={<Navigate to="/docs" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </OnboardingProvider>
      </ProjectProvider>
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

  // Auth parked — browse goes straight into the app, no sign-in detour.
  const handleBrowse = () => navigate("/docs");

  return <LandingPage onBrowse={handleBrowse} />;
}