import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@vaultui/ui";
import { useAuth } from "../auth/AuthContext";
import { useProjects } from "../projects/ProjectContext";

/**
 * First-time onboarding — a short, non-blocking tour.
 *
 *  - Auto-starts ONLY on the user's very first login (per-user `hasOnboarded`
 *    flag, stored in the profiles row / demo registry — so logout → login
 *    never shows it again).
 *  - The flag is marked consumed the moment the tour auto-starts, so even an
 *    interrupted first visit won't re-trigger it.
 *  - Steps with a target id silently skip themselves when the target isn't
 *    on the current page (e.g. the sidebar step on a project page).
 *  - The spotlight + tooltip overlay is pointer-transparent except for the
 *    card itself, so the page stays fully clickable during the tour.
 *  - "Replay guide" in the account menu (or the ? header button) restarts it any time.
 */

type Step = {
  id: string;
  targetId?: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    id: "welcome",
    title: "Welcome to Vault UI 🎉",
    body: "Three moves: ① create a project — your personal kit — ② browse the vault and tap “Add to project” on anything you like, ③ open your project and download your custom kit, with its own install command.",
  },
  {
    id: "project",
    targetId: "onboard-project-chip",
    title: "This is your project",
    body: "Everything you add in the vault lands in this project. Click it any time — the badge shows how many components you've collected so far.",
  },
  {
    id: "sidebar",
    targetId: "onboard-sidebar",
    title: "Browse the vault",
    body: "Every component and dashboard template lives here. Search, then click a name for a live preview, usage code and the “Add to project” button.",
  },
  {
    id: "add",
    targetId: "onboard-add",
    title: "Add to your kit",
    body: "Found a keeper? Hit “Add to project” and it's saved instantly. Once added, the button flips to “In <project>” with a remove control.",
  },
  {
    id: "theme",
    targetId: "onboard-theme",
    title: "Try the themes",
    body: "Four live themes — Neumorphic, Glassmorphism, Dimensional Layering and Vintage Retro Film. Every preview re-skins in the theme you pick.",
  },
];

interface OnboardingContextValue {
  startTour: () => void;
  isActive: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, user, markOnboarded } = useAuth();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const location = useLocation();

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const autoStarted = useRef(false);

  const startTour = useCallback(() => {
    setIndex(0);
    setOpen(true);
  }, []);

  const stopTour = useCallback(() => {
    setOpen(false);
  }, []);

  /* Auto-start once per user — only on their very first login. */
  useEffect(() => {
    if (!isSignedIn || !user) return;
    const appPage =
      location.pathname.startsWith("/docs") || location.pathname.startsWith("/projects");
    if (!appPage || autoStarted.current) return;
    if (user.hasOnboarded) return;
    autoStarted.current = true;
    // Defer render-side state so the compiler lint is satisfied (setState
    // happens after commit, not synchronously inside the effect).
    const t = window.setTimeout(() => startTour(), 0);
    // Consume the flag immediately: this is the user's first-time visit; a
    // later logout → login must never replay it.
    void markOnboarded();
    return () => window.clearTimeout(t);
  }, [isSignedIn, user, location.pathname, startTour, markOnboarded]);

  /* Skip steps whose target isn't on the current page (auto-advance). */
  useEffect(() => {
    if (!open) return;
    const step = STEPS[index];
    if (!step) {
      const t = window.setTimeout(stopTour, 0);
      return () => window.clearTimeout(t);
    }
    if (step.targetId && !document.getElementById(step.targetId)) {
      const t = window.setTimeout(() => setIndex((i) => i + 1), 0);
      return () => window.clearTimeout(t);
    }
  }, [open, index, stopTour]);

  /* ESC closes the tour (marks done). */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopTour();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, stopTour]);

  const step = open ? STEPS[index] : null;

  return (
    <OnboardingContext.Provider value={{ startTour, isActive: open }}>
      {children}
      {open && step && (
        <TourStep
          key={step.id}
          step={step}
          index={index}
          total={STEPS.length}
          projectsExist={projects.length > 0}
          onNext={() => setIndex((i) => i + 1)}
          onSkip={stopTour}
          onGoProjects={() => {
            navigate("/projects");
            setIndex((i) => i + 1);
          }}
        />
      )}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error("useOnboarding must be used within <OnboardingProvider>");
  return value;
}

/* ------------------------------ tour overlay ------------------------------ */

function TourStep({
  step,
  index,
  total,
  projectsExist,
  onNext,
  onSkip,
  onGoProjects,
}: {
  step: Step;
  index: number;
  total: number;
  projectsExist: boolean;
  onNext: () => void;
  onSkip: () => void;
  onGoProjects: () => void;
}) {
  const rect = useTargetRect(step.targetId);
  const pos = positionFor(rect);

  const isLast = index >= total - 1;
  const isWelcome = index === 0;

  return (
    <>
      {/* Dim + spotlight hole — purely visual, never blocks clicks */}
      {rect && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[70]"
          style={{
            boxShadow: "0 0 0 9999px rgba(16, 24, 42, 0.55)",
            clipPath: `polygon(
              0 0, 100vw 0, 100vw 100vh, 0 100vh,
              0 0,
              ${rect.left}px 0,
              ${rect.left}px ${rect.top}px,
              ${rect.left + rect.width}px ${rect.top}px,
              ${rect.left + rect.width}px ${rect.bottom}px,
              ${rect.left}px ${rect.bottom}px,
              ${rect.left}px ${rect.top}px,
              0 ${rect.top}px
            )`,
          }}
        />
      )}
      {rect && <HighlightRing rect={rect} />}

      {/* Tooltip card */}
      <div
        role="dialog"
        aria-label={step.title}
        className="fixed z-[80] w-[320px] max-w-[calc(100vw-24px)] rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-raised animate-rise"
        style={{ left: pos.left, top: pos.top }}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
            Tip {index + 1} of {total}
          </span>
          <button
            type="button"
            aria-label="Close guide"
            onClick={onSkip}
            className="rounded-md p-0.5 text-surface-400 transition-colors hover:text-surface-700"
          >
            ✕
          </button>
        </div>
        <h3 className="mt-2 text-sm font-bold tracking-tight text-surface-900">{step.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-surface-500">{step.body}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Button size="sm" variant="ghost" onClick={onSkip}>
            Skip tour
          </Button>
          <div className="flex items-center gap-2">
            {isWelcome && (
              <Button size="sm" variant="secondary" onClick={onGoProjects}>
                {projectsExist ? "Open my projects" : "Create my first project"}
              </Button>
            )}
            {!isLast && (
              <Button size="sm" onClick={onNext}>
                Next
              </Button>
            )}
            {isLast && (
              <Button size="sm" onClick={onSkip}>
                Got it
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Rounded ring drawn around the spotlighted element (visual only). */
function HighlightRing({ rect }: { rect: DOMRect }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[70] rounded-xl border-2 border-brand-400"
      style={{
        left: rect.left - 4,
        top: rect.top - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      }}
    />
  );
}

/* ------------------------------- positioning ------------------------------ */

function useTargetRect(targetId: string | undefined) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = targetId ? document.getElementById(targetId) : null;
      setRect(el ? el.getBoundingClientRect() : null);
    };
    if (!targetId) return;
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [targetId]);

  return rect;
}

/** Place the card near the target (above if it would overflow), else centered. */
function positionFor(rect: DOMRect | null): { left: number; top: number } {
  const W = 320;
  const H = 210;
  const GAP = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!rect) {
    return {
      left: Math.max(12, (vw - W) / 2),
      top: Math.max(12, (vh - H) / 2 - 40),
    };
  }

  let left = rect.left + rect.width / 2 - W / 2;
  left = Math.max(12, Math.min(left, vw - W - 12));
  let top = rect.bottom + GAP;
  if (top + H > vh - 12 && rect.top - H - GAP > 0) {
    top = rect.top - H - GAP;
  }
  // Never leave the card off-screen (e.g. full-height rails like the
  // sidebar step, where neither below nor above fits) — clamp into view.
  top = Math.max(12, Math.min(top, vh - H - 12));
  return { left, top };
}