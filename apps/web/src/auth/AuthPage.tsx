import { useState, type FormEvent } from "react";
import { Badge, Button, Card } from "@vaultui/ui";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, MailCheck, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "./AuthContext";
import { validateEmail, validatePassword } from "./mockAuth";

/**
 * Auth page — sign-in / sign-up / forgot-password.
 *
 * Validation runs client-side (email format, password strength, confirm
 * match) AND the engine re-validates: demo mode against its account
 * registry, Supabase server-side. Sign-in requires an existing account;
 * sign-up leads to an email-verification state (real Supabase sends the
 * link; demo simulates the step).
 */

type Step = "form" | "verification" | "reset" | "reset-sent";

const EMAIL_INPUT_CLASS =
  "h-10 w-full rounded-xl border-0 bg-surface-100 px-3 text-sm text-surface-800 shadow-inset outline-none placeholder:text-surface-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20";

export function AuthPage({ mode: reqMode }: { mode: "sign-in" | "sign-up" }) {
  const { mode, signIn, signUp, resendVerification, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/docs";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const notice = (location.state as { notice?: string } | null)?.notice ?? null;

  const isUp = reqMode === "sign-up";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const badEmail = validateEmail(email);
    if (badEmail) return setError(badEmail);

    if (isUp) {
      const badPassword = validatePassword(password);
      if (badPassword) return setError(badPassword);
      if (!name.trim()) return setError("Name is required.");
      if (password !== confirm) return setError("Passwords do not match.");
      setLoading(true);
      const res = await signUp(name, email, password);
      setLoading(false);
      if (!res.ok) return setError(res.error);
      if (mode === "mock") {
        // Demo mode sends no email — go straight to sign-in (mirrors real flow).
        navigate("/sign-in", {
          replace: true,
          state: { from, notice: "Account created — now sign in with your email and password (demo, no email needed)." },
        });
      } else {
        setStep("verification");
      }
      return;
    }

    if (!password) return setError("Password is required.");
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (!res.ok) {
      if (res.needsVerification) setStep("verification");
      return setError(res.error);
    }
    navigate(from, { replace: true });
  };

  const resend = async () => {
    setResent(true);
    await resendVerification();
    window.setTimeout(() => setResent(false), 2000);
  };

  const resetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const badEmail = validateEmail(email);
    if (badEmail) return setError(badEmail);
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (!res.ok) return setError(res.error);
    setStep("reset-sent");
  };

  /* ----------------------------- verification ---------------------------- */
  if (step === "verification") {
    return (
      <AuthShell>
        <Card padding="lg" className="relative overflow-hidden text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-soft">
            <MailCheck className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-surface-900">Check your inbox</h1>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            We sent a confirmation link to <span className="font-semibold text-surface-800">{email}</span>.
            Open it to activate your account.
          </p>
          <Button fullWidth size="lg" className="mt-5" onClick={resend} disabled={resent}>
            {resent ? "Re-sent ✓" : "Resend confirmation"}
          </Button>
          <p className="mt-4 rounded-xl bg-warning-500/10 px-3 py-2 text-left text-[11px] leading-relaxed text-warning-500">
            Not receiving it? Check spam/junk, confirm <code className="font-mono">Email → Confirm email</code> is
            enabled in Supabase Auth settings, and look under <code className="font-mono">Logs → Auth</code> — new
            projects hit Supabase's default email rate limits until custom SMTP is configured.
          </p>
          <p className="mt-4 text-center text-sm text-surface-500">
            Already confirmed?{" "}
            <Link to="/sign-in" state={{ from }} className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </Card>
      </AuthShell>
    );
  }

  /* ------------------------------ reset sent ----------------------------- */
  if (step === "reset-sent") {
    return (
      <AuthShell>
        <Card padding="lg" className="relative overflow-hidden text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-soft">
            <MailCheck className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-surface-900">Reset link sent</h1>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            If <span className="font-semibold text-surface-800">{email}</span> has an account, a reset link is on
            its way. {mode === "mock" ? "(Demo mode — no real email is sent.)" : ""}
          </p>
          <Button fullWidth size="lg" className="mt-5" onClick={() => setStep("form")}>
            Back to sign in
          </Button>
        </Card>
      </AuthShell>
    );
  }

  /* ------------------------------- reset form ---------------------------- */
  if (step === "reset") {
    return (
      <AuthShell>
        <Card padding="lg">
          <h1 className="text-xl font-bold tracking-tight text-surface-900">Reset password</h1>
          <p className="mt-1 text-sm text-surface-500">We'll email you a secure reset link.</p>
          <form onSubmit={resetSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-surface-600">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@vault.dev" className={EMAIL_INPUT_CLASS} />
            </label>
            {error && <p className="text-sm text-danger-500">{error}</p>}
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-surface-500">
            Remembered it?{" "}
            <button type="button" onClick={() => setStep("form")} className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </button>
          </p>
        </Card>
      </AuthShell>
    );
  }

  /* --------------------------------- form -------------------------------- */
  return (
    <AuthShell>
      <Card padding="lg" className="relative overflow-hidden">
        <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white shadow-soft">
          V
        </div>
        <h1 className="mt-4 text-center text-xl font-bold tracking-tight text-surface-900">
          {isUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-center text-sm text-surface-500">
          {isUp ? "Free core forever — premium when you upgrade." : "Sign in to view premium kits and dashboards."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {isUp && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-surface-600">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ada Lovelace" className={EMAIL_INPUT_CLASS} />
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-surface-600">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@vault.dev" className={EMAIL_INPUT_CLASS} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-surface-600">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className={EMAIL_INPUT_CLASS} />
            {isUp && (
              <span className="mt-1 block text-[11px] text-surface-400">
                At least 8 characters, upper &amp; lower case, one number.
              </span>
            )}
          </label>
          {isUp && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-surface-600">Confirm password</span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="••••••••" className={EMAIL_INPUT_CLASS} />
            </label>
          )}

          {notice && (
            <p role="status" className="rounded-lg bg-success-500/10 px-3 py-2 text-sm text-success-500">
              {notice}
            </p>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-danger-500/10 px-3 py-2 text-sm text-danger-500">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading} leadingIcon={isUp ? <UserPlus className="size-4" /> : <LogIn className="size-4" />}>
            {loading ? "One moment…" : isUp ? "Create account" : "Sign in"}
          </Button>
        </form>

        {!isUp && (
          <p className="mt-3 text-center text-sm">
            <button
              type="button"
              onClick={() => setStep("reset")}
              className="font-medium text-surface-500 hover:text-surface-800"
            >
              Forgot password?
            </button>
          </p>
        )}

        <p className="mt-4 text-center text-sm text-surface-500">
          {isUp ? (
            <>
              Already have an account?{" "}
              <Link to="/sign-in" state={{ from }} className="font-semibold text-brand-600 hover:text-brand-700">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link to="/sign-up" state={{ from }} className="font-semibold text-brand-600 hover:text-brand-700">
                Create a free account — sign-up comes first
              </Link>
            </>
          )}
        </p>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-surface-400">
          <Badge variant={mode === "supabase" ? "success" : "warning"} size="sm">
            <ShieldCheck className="mr-1 size-3" /> {mode === "supabase" ? "Supabase auth" : "demo mode"}
          </Badge>
          {mode === "mock" ? "Add Supabase keys (src/auth) to go live." : "Server-validated · email verification on."}
        </p>
      </Card>
    </AuthShell>
  );
}

/** Centered page shell behind the auth card. */
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-500 transition-colors hover:text-surface-800">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        {children}
      </div>
    </div>
  );
}