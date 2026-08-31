import { Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { useAuth } from "./AuthContext";

/**
 * Header auth control — "Sign in" button when signed out; a single rounded
 * profile-icon button when signed in (no dropdown). Clicking the icon opens
 * your workspace (/projects).
 */
export function AuthControl() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isSignedIn) {
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

  return (
    <button
      type="button"
      onClick={() => navigate("/projects")}
      title="Your workspace"
      aria-label="Your workspace"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full",
        "border-0 bg-surface-0 text-surface-600 shadow-soft",
        "transition-all hover:text-surface-900 active:shadow-pressed",
      )}
    >
      <CircleUserRound className="size-5" />
    </button>
  );
}