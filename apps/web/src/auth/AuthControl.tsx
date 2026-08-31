import { useEffect, useRef, useState } from "react";
import { Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Crown, Folder, LayoutDashboard, LogOut, RotateCcw } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useOnboarding } from "../onboarding/OnboardingContext";

/** Header auth control — "Sign in" button when signed out, avatar menu when signed in. */
export function AuthControl() {
  const { isSignedIn, user, signOut, upgrade, isPremium } = useAuth();
  const { startTour } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!isSignedIn || !user) {
    return (
      <Button
        variant="secondary"
        size="sm"
        className="hidden sm:inline-flex"
        onClick={() => navigate("/sign-in", { state: { from: location.pathname } })}
      >
        Sign in
      </Button>
    );
  }

  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border-0 bg-surface-0 py-0 pl-0.5 pr-2 shadow-soft transition-all hover:text-surface-900 active:shadow-pressed"
      >
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-brand-600 text-xs font-bold text-white">
          {initials}
        </span>
        <ChevronDown className={cn("size-3.5 text-surface-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-surface-200 bg-surface-0 p-1.5 shadow-popover animate-rise"
        >
          <div className="px-2.5 pb-1.5 pt-2">
            <p className="truncate text-sm font-semibold text-surface-900">{user.name}</p>
            <p className="truncate text-xs text-surface-400">{user.email}</p>
            <span
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isPremium ? "bg-brand-100 text-brand-700" : "bg-surface-100 text-surface-500",
              )}
            >
              {isPremium ? (
                <>
                  <Crown className="size-3" /> premium
                </>
              ) : (
                "free plan"
              )}
            </span>
          </div>

          <div className="border-t border-surface-100 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/projects");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100"
            >
              <Folder className="size-4 text-brand-600" />
              My projects
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/docs");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100"
            >
              <LayoutDashboard className="size-4 text-brand-600" />
              Browse docs
            </button>
            {!isPremium && (
              <button
                type="button"
                onClick={() => {
                  upgrade();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100"
              >
                <Crown className="size-4 text-brand-600" />
                Upgrade to premium (demo)
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                startTour();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100"
            >
              <RotateCcw className="size-4 text-surface-400" />
              Replay guide
            </button>
            <button
              type="button"
              onClick={() => {
                signOut();
                setOpen(false);
                navigate("/");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
            >
              <LogOut className="size-4 text-surface-400" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}