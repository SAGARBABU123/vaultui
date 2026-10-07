/**
 * Auth switch — PARKED for now.
 *
 * `false` → the whole app is open. No sign-in / sign-up UI, every page
 *           (docs, kits, projects, premium content) is reachable, and
 *           projects are stored locally under one guest identity.
 * `true`  → restores the full Supabase auth flow. All auth code (AuthPage,
 *           AuthContext Supabase path, AccessGate, RLS) is still here, so
 *           flipping this one flag brings it back.
 *
 * The Supabase project is still kept warm by /api/keepalive + the daily
 * crons, so turning auth back on later will "just work".
 */
export const AUTH_ENABLED = false;
