import { useEffect, useRef, useState } from "react";
import { cn } from "@vaultui/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound, FolderOpen, LogIn, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "./AuthContext";

/**
 * Header auth control — a profile-icon button with a context-aware menu.
 *
 *  Signed out        → Sign in · Sign up
 *  Signed in, landing→ Sign out
 *  Signed in, app    → My projects · Sign out   (docs / workspace pages)
 *
 * The menu closes on outside click and Escape; Sign out stays on the page.
 */
export function AuthControl() {
  const { isSignedIn, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const onLanding = location.pathname === "/";

  // Close on outside click / Escape / route change.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the menu on route change (incl. browser back/forward). Open/close is
  // cheap and idempotent — no cascading renders here.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [location.pathname]);

  const go = (to: string) => {
    setOpen(false);
    navigate(to, { state: { from: location.pathname } });
  };

  const doSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={isSignedIn ? (user?.name ?? "Account") : "Account"}
        aria-label={isSignedIn ? `Account menu — ${user?.name ?? ""}`.trim() : "Account menu"}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full",
          "border-0 bg-surface-0 text-surface-600 shadow-soft",
          "transition-all hover:text-surface-900 active:shadow-pressed",
        )}
      >
        <CircleUserRound className="size-5" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-50 mt-2 min-w-[10.5rem] overflow-hidden rounded-xl border border-surface-200 bg-surface-50 p-1 shadow-popover animate-rise"
        >
          {!isSignedIn ? (
            <>
              <MenuItem icon={<LogIn className="size-4" />} label="Sign in" onClick={() => go("/sign-in")} />
              <MenuItem icon={<UserPlus className="size-4" />} label="Sign up" onClick={() => go("/sign-up")} />
            </>
          ) : (
            <>
              {!onLanding && (
                <MenuItem icon={<FolderOpen className="size-4" />} label="My projects" onClick={() => go("/projects")} />
              )}
              <MenuItem icon={<LogOut className="size-4" />} label="Sign out" onClick={() => void doSignOut()} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-surface-900"
    >
      <span className="text-surface-400">{icon}</span>
      {label}
    </button>
  );
}