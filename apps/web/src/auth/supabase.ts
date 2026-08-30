import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client — created lazily only when the env keys are present.
 * Returns null for the demo-mode build (no keys → mock auth in AuthContext).
 */
export function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !url.startsWith("http")) return null;
  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/** True when the app is wired to a real Supabase project. */
export const supabaseConfigured = () => getSupabase() !== null;