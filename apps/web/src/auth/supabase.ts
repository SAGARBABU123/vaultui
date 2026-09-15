import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client — created lazily only when the env keys are present.
 * Returns null for the demo-mode build (no keys → mock auth in AuthContext).
 *
 * The client is cached at module scope so every caller (AuthProvider,
 * projects/api) shares ONE instance. Without the cache, each render that
 * calls getSupabase() got a brand-new client — and the new identity re-ran
 * AuthProvider's bootstrap effect on every setUser, hammering
 * /rest/v1/profiles in an endless loop.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !url.startsWith("http")) {
    cached = null;
    return cached;
  }
  cached = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cached;
}

/** True when the app is wired to a real Supabase project. */
export const supabaseConfigured = () => getSupabase() !== null;