/**
 * Vault UI — keepalive / uptime probe (Vercel serverless function).
 *
 * Why: Supabase **free-tier projects are paused after 7 days without
 * activity**. A paused project makes sign-in and all data reads fail until
 * it is manually restored in the dashboard. This endpoint performs a real
 * Postgres round-trip through Supabase's REST API, so a scheduled Vercel
 * Cron keeps the project active with zero manual intervention.
 *
 * It doubles as a lightweight health check for the deployment.
 *
 * Env (already set on the Vercel project):
 *   VITE_SUPABASE_URL        — Supabase project URL
 *   VITE_SUPABASE_ANON_KEY   — public anon key (safe to use server-side)
 *
 * Triggered by `crons` in vercel.json (daily). Safe to call manually too:
 *   curl https://<project>.vercel.app/api/keepalive
 */

export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ error: "GET only" });
  }

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  const body: Record<string, unknown> = {
    ok: true,
    service: "vault-ui",
    ts: new Date().toISOString(),
  };

  if (!url || !key) {
    // Not fatal — the app can run in demo mode without Supabase.
    body.supabase = "skipped (Supabase env not configured)";
    return res.status(200).json(body);
  }

  try {
    // An actual DB query: RLS returns [] for anon, but Postgres still runs it,
    // which is exactly the "activity" Supabase counts against auto-pause.
    const r = await fetch(`${url}/rest/v1/projects?select=id&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    body.supabaseStatus = r.status;
    body.supabaseUrl = url;

    if (!r.ok) {
      body.ok = false;
      body.supabaseError = (await r.text().catch(() => "")).slice(0, 300);
      return res.status(502).json(body);
    }
  } catch (err) {
    body.ok = false;
    body.supabaseError = String(err).slice(0, 300);
    return res.status(502).json(body);
  }

  return res.status(200).json(body);
}
