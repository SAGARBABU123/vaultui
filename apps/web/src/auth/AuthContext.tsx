import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabase } from "./supabase";
import { AUTH_ENABLED } from "./config";
import {
  demoMarkOnboarded,
  demoReadSession,
  demoSignIn,
  demoSignOut,
  demoSignUp,
  demoUpgrade,
} from "./mockAuth";

/**
 * Vault UI auth — one surface, two engines.
 *
 *  REAL (default when keys exist):  VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
 *    → Supabase Auth: server-side validation, signup-before-signin enforced,
 *      email verification, password reset, session refresh. Role comes from
 *      the RLS-protected `profiles` table (see supabase/migrations).
 *
 *  DEMO (no keys): hardened localStorage mock — real validation, account
 *    registry with salted hashes, sign-in requires an existing account,
 *    generic errors, 5-attempt cooldown. Badged "demo mode"; never for prod.
 *
 * The `useAuth()` surface is identical in both modes, so the UI never changes.
 */

export type AuthRole = "free" | "premium";

export interface AuthUser {
  /** Stable owner key — supabase user id, demo email (mock mode). */
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  /** First-time onboarding consumed? Stored per user (profiles table / demo registry). */
  hasOnboarded: boolean;
}

export type AuthMode = "supabase" | "mock";

export type AuthResult = { ok: true; needsVerification?: boolean } | { ok: false; error: string; needsVerification?: boolean };

export type AuthStatus = "signed-out" | "signed-in";

interface AuthContextValue {
  /** Which engine is active. */
  mode: AuthMode;
  user: AuthUser | null;
  isSignedIn: boolean;
  isPremium: boolean;
  status: AuthStatus;
  /** Last auth error (form never throws — read this instead). */
  error: string | null;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  /** Send a password reset link (Supabase; simulated confirmation in demo). */
  forgotPassword: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  upgrade: () => Promise<void>;
  /** Mark the first-time guide as consumed — per-user, survives logout/login. */
  markOnboarded: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Single open identity used while auth is parked (config.AUTH_ENABLED = false). */
const GUEST_USER: AuthUser = {
  id: "guest",
  name: "Guest",
  email: "guest@vaultui.local",
  role: "premium",
  hasOnboarded: true,
};

function userFromSupabase(session: { user?: { id?: string; email?: string | null; user_metadata?: { name?: string } } } | null): AuthUser | null {
  const email = session?.user?.email;
  if (!email) return null;
  return {
    id: session?.user?.id ?? email,
    name: session?.user?.user_metadata?.name ?? email.split("@")[0]!,
    email,
    role: "free",
    hasOnboarded: false, // refined below from the RLS-protected profiles row
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth parked → no Supabase client, guest identity, everything unlocked.
  const supabase = AUTH_ENABLED ? getSupabase() : null;
  const [mode] = useState<AuthMode>(supabase ? "supabase" : "mock");
  const [user, setUser] = useState<AuthUser | null>(() =>
    AUTH_ENABLED ? (supabase ? null : demoReadSession()) : GUEST_USER,
  );
  const [error, setError] = useState<string | null>(null);

  // Derived — a session equals a signed-in user.
  const status: AuthStatus = user ? "signed-in" : "signed-out";

  const clearError = useCallback(() => setError(null), []);

  /* ------------------------------ role loader ----------------------------- */
  const syncRole = useCallback(
    async (base: AuthUser) => {
      if (mode !== "supabase") return base;
      try {
        const { data, error } = await supabase!
          .from("profiles")
          .select("role, has_onboarded")
          .eq("id", base.id) // explicit owner filter — never trust a bare maybeSingle
          .maybeSingle();
        if (error) throw error;
        if (data) {
          if (data.role === "premium") base = { ...base, role: "premium" as const };
          // Row present → the flag is authoritative (both values, not just true).
          base = { ...base, hasOnboarded: data.has_onboarded === true };
        }
        // No row (rare: pre-trigger signup) → treated as a brand-new user.
      } catch (err) {
        // Table/column missing (migrations not applied) or RLS misconfig.
        // Loud so setup issues surface; OnboardingContext additionally uses a
        // same-device marker so the tour never replays on every login.
        console.error("[auth] profile read failed — hasOnboarded unknown:", err);
      }
      return base;
    },
    [mode, supabase],
  );

  /* --------------------------- session bootstrap -------------------------- */
  useEffect(() => {
    if (mode !== "supabase" || !supabase) return;

    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      const u = userFromSupabase(data.session);
      if (u) {
        void syncRole(u).then((full) => {
          if (alive) setUser(full);
        });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const u = userFromSupabase(session);
      if (u) {
        void syncRole(u).then((full) => {
          if (alive) setUser(full);
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [mode, supabase, syncRole]);

  /* -------------------------------- actions ------------------------------- */

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      clearError();
      if (mode === "mock") {
        const res = await demoSignIn(email, password);
        if (!res.ok) {
          setError(res.error);
          return res;
        }
        setUser(demoReadSession());
        return { ok: true };
      }

      const { data, error: err } = await supabase!.auth.signInWithPassword({ email, password });
      if (err) {
        const message =
          err.code === "email_not_confirmed"
            ? "Please confirm your email first — we sent a verification link."
            : "Invalid email or password.";
        setError(message);
        return { ok: false, error: message, needsVerification: err.code === "email_not_confirmed" };
      }
      const u = userFromSupabase(data.session);
      if (!u) return { ok: false, error: "Could not start a session." };
      const full = await syncRole(u);
      setUser(full);
      return { ok: true };
    },
    [mode, supabase, syncRole, clearError],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      clearError();
      if (mode === "mock") {
        const res = await demoSignUp(name, email, password);
        if (!res.ok) {
          setError(res.error);
          return res;
        }
        // Sign-up is complete; the user signs in explicitly (mirrors real flow).
        return { ok: true, needsVerification: true };
      }

      const { error: err } = await supabase!.auth.signUp({
        email,
        password,
        options: { data: { name: name.trim() } },
      });
      if (err) {
        const message =
          err.code === "user_already_exists" ? "An account with this email already exists." : err.message;
        setError(message);
        return { ok: false, error: message };
      }
      // Supabase sends a confirmation email (default) — user confirms, then signs in.
      return { ok: true, needsVerification: true };
    },
    [mode, supabase, clearError],
  );

  const forgotPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      clearError();
      if (mode === "mock") {
        // Simulated reset — the registry is demo-only, no real email.
        return { ok: true };
      }
      const { error: err } = await supabase!.auth.resetPasswordForEmail(email);
      if (err) {
        setError(err.message);
        return { ok: false, error: err.message };
      }
      return { ok: true };
    },
    [mode, supabase, clearError],
  );

  const signOut = useCallback(async () => {
    if (mode === "mock") demoSignOut();
    else await supabase!.auth.signOut();
    setUser(null);
  }, [mode, supabase]);

  const upgrade = useCallback(async () => {
    if (mode === "mock") {
      const upgraded = demoUpgrade();
      if (upgraded) setUser(upgraded);
      return;
    }
    // Real path: security-definer function owns the write (migration 0001).
    const { error: err } = await supabase!.rpc("grant_premium");
    if (!err && user) {
      setUser({ ...user, role: "premium" });
    }
  }, [mode, supabase, user]);

  const markOnboarded = useCallback(async () => {
    if (mode === "mock") {
      const updated = demoMarkOnboarded();
      if (updated) setUser(updated);
      return;
    }
    if (!user) return;
    try {
      await supabase!.from("profiles").update({ has_onboarded: true }).eq("id", user.id);
      setUser({ ...user, hasOnboarded: true });
    } catch (err) {
      console.error("[auth] could not persist has_onboarded — relying on same-device marker:", err);
      /* keeps the flag in-memory if the write fails */
      setUser({ ...user, hasOnboarded: true });
    }
  }, [mode, supabase, user]);

  return (
    <AuthContext.Provider
      value={{
        mode,
        user,
        isSignedIn: status === "signed-in" && user !== null,
        isPremium: user?.role === "premium",
        status,
        error,
        clearError,
        signIn,
        signUp,
        forgotPassword,
        signOut,
        upgrade,
        markOnboarded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within <AuthProvider>");
  return value;
}