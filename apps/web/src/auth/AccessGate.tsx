import { Button, Badge } from "@vaultui/ui";
import { useLocation, useNavigate } from "react-router-dom";
import { Crown, Lock, LogIn } from "lucide-react";
import { useAuth } from "./AuthContext";

/**
 * Inline gate for protected content.
 * - Dashboards → need an account (free members included).
 * - Premium    → need the premium role (demo upgrade flips it instantly).
 */
export function AccessGate({ kind }: { kind: "premium" | "dashboard" }) {
  const { isSignedIn, upgrade } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.pathname;

  const goSignIn = () => navigate("/sign-in", { state: { from } });

  const title =
    kind === "dashboard"
      ? "This template requires a free account"
      : isSignedIn
        ? "This component is in the premium kit"
        : "This component is in the premium kit";

  const body =
    kind === "dashboard"
      ? "Sign in for free to preview the full dashboard template and every theme — Neumorphic, Glassmorphism, Dimensional Layering and Vintage Retro Film."
      : isSignedIn
        ? "Your free account covers the core library. Upgrade to premium (demo: unlocks instantly) to view the full kit — or sign in with a premium account."
        : "Sign in to see it — free accounts can browse the core library, premium unlocks the paid kits and every dashboard template.";

  return (
    <div className="animate-rise">
      <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-surface-200 bg-surface-0 p-8 text-center shadow-raised">
        {/* ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-brand-300/30 blur-3xl"
        />

        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-soft">
          {kind === "dashboard" ? <Lock className="size-6" /> : <Crown className="size-6" />}
        </span>

        <h1 className="mt-5 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-surface-500">{body}</p>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
          {kind === "premium" && isSignedIn ? (
            <Button size="lg" onClick={upgrade} leadingIcon={<Crown className="size-4" />}>
              Unlock premium (demo)
            </Button>
          ) : (
            <Button size="lg" onClick={goSignIn} leadingIcon={<LogIn className="size-4" />}>
              Sign in to continue
            </Button>
          )}
          {kind === "premium" && !isSignedIn && (
            <Button variant="secondary" size="lg" onClick={goSignIn}>
              Create account
            </Button>
          )}
        </div>

        <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-surface-400">
          <Badge variant="neutral" size="sm">demo auth</Badge>
          Free core stays open — only premium kits and dashboard templates are gated.
        </p>
      </div>
    </div>
  );
}