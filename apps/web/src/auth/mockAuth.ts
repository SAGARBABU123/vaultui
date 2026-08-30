import type { AuthRole } from "./AuthContext";

/**
 * HARDENED DEMO AUTH — not for production.
 *
 * Behaves like real server-side auth so the flow is honest to test:
 *  - sign-up creates an account record (salted SHA-256 hash — demo-grade)
 *  - sign-in REQUIRES an existing record AND a matching password hash
 *  - generic "Invalid email or password" (no account enumeration)
 *  - email format + password strength validation
 *  - 5 failed attempts → 30s cooldown per email
 *  - sessions expire after 7 days
 *
 * Swap: when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set, AuthContext
 * uses real Supabase auth and this module is never called.
 */

export interface DemoUser {
  name: string;
  email: string;
  role: AuthRole;
}

export interface DemoCredentials {
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
  role: AuthRole;
}

const USERS_KEY = "vault-ui-users";
const SESSION_KEY = "vault-ui-auth";
const ATTEMPTS_KEY = "vault-ui-login-attempts";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

export type DemoResult = { ok: true; needsVerification?: boolean } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------ storage io ------------------------------ */

function readUsers(): Record<string, DemoCredentials> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}") as Record<string, DemoCredentials>;
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, DemoCredentials>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readAttempts(): Record<string, { count: number; lockedUntil: number }> {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) ?? "{}") as Record<
      string,
      { count: number; lockedUntil: number }
    >;
  } catch {
    return {};
  }
}

function writeAttempts(attempts: Record<string, { count: number; lockedUntil: number }>) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

/* -------------------------------- crypto -------------------------------- */

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------- validation ------------------------------ */

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) return "Use both upper and lower case letters.";
  if (!/\d/.test(password)) return "Add at least one number.";
  return null;
}

/* -------------------------------- actions ------------------------------- */

export async function demoSignUp(name: string, email: string, password: string): Promise<DemoResult> {
  const badEmail = validateEmail(email);
  if (badEmail) return { ok: false, error: badEmail };
  const badPassword = validatePassword(password);
  if (badPassword) return { ok: false, error: badPassword };
  if (!name.trim()) return { ok: false, error: "Name is required." };

  const users = readUsers();
  const key = email.toLowerCase();
  if (users[key]) return { ok: false, error: "An account with this email already exists." };

  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  users[key] = { name: name.trim(), email: key, salt, passwordHash, role: "free" };
  writeUsers(users);
  return { ok: true };
}

export async function demoSignIn(email: string, password: string): Promise<DemoResult> {
  const badEmail = validateEmail(email);
  if (badEmail) return { ok: false, error: "Invalid email or password." };

  const key = email.toLowerCase();
  const now = Date.now();

  // Cooldown — generic response either way (no enumeration).
  const attempts = readAttempts();
  const record = attempts[key];
  if (record && record.lockedUntil > now) {
    const secs = Math.ceil((record.lockedUntil - now) / 1000);
    return { ok: false, error: `Too many attempts — try again in ${secs}s.` };
  }

  const users = readUsers();
  const cred = users[key];
  const passwordHash = cred ? await hashPassword(password, cred.salt) : null;
  const match = cred && passwordHash === cred.passwordHash;

  if (!match) {
    const current = attempts[key] ?? { count: 0, lockedUntil: 0 };
    const count = current.count + 1;
    const lockedUntil = count >= MAX_ATTEMPTS ? now + COOLDOWN_MS : 0;
    attempts[key] = { count: lockedUntil ? 0 : count, lockedUntil };
    writeAttempts(attempts);
    return { ok: false, error: "Invalid email or password." };
  }

  delete attempts[key];
  writeAttempts(attempts);

  const user: DemoUser = { name: cred!.name, email: key, role: cred!.role };
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...user, expiresAt: now + SESSION_TTL_MS }),
  );
  return { ok: true };
}

export function demoReadSession(): DemoUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoUser> & { expiresAt?: number };
    if (!parsed.email || !parsed.expiresAt || parsed.expiresAt < Date.now()) return null;
    return { name: parsed.name ?? "Explorer", email: parsed.email, role: (parsed.role ?? "free") as AuthRole };
  } catch {
    return null;
  }
}

export function demoSignOut() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function demoUpgrade(): DemoUser | null {
  const user = demoReadSession();
  if (!user) return null;
  const upgraded: DemoUser = { ...user, role: "premium" };
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...upgraded, expiresAt: Date.now() + SESSION_TTL_MS }),
  );
  return upgraded;
}