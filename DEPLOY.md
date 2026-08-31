# 🚀 Deploying Vault UI — free tier, no domain needed

**Your app in one line:** a Vite + React SPA (`apps/web`) backed entirely by **Supabase**
(auth, Postgres, RLS, RPC). There is **no custom backend server**, so Render is not
part of the stack today — adding it would deploy an empty process for no benefit.

| Layer        | Where it lives                 | Choice (all free)                          |
| ------------ | ------------------------------ | ------------------------------------------ |
| Frontend     | `apps/web` (Vite SPA)          | **Vercel** (recommended) or Cloudflare Pages|
| Auth + DB    | Supabase (Postgres + Auth + RLS) | **Supabase free tier**                    |
| Backend API  | — (none exists)                | Skip Render (see "When you need Render")   |

Both hosting options give you a public URL for free — no domain purchase needed.
- Vercel → `https://<project>.vercel.app`
- Cloudflare → `https://<project>.pages.dev`

---

## Option A — Vercel (recommended) · ~10 minutes

Why Vercel wins here: it auto-detects **pnpm + Turborepo + Vite**, deploys on every
push to `main`, gives preview URLs per PR, and the SPA rewrite config is already in
`vercel.json`.

1. Push this repo to GitHub (it already has your `origin`):
   ```bash
   git add -A && git commit -m "deploy: add Vercel/Cloudflare config + SPA rewrites" && git push
   ```
2. Go to https://vercel.com/new → **Import** your GitHub repo (`SAGARBABU123/vaultui`).
3. Use these settings (Vercel auto-detects most of them):
   - **Framework Preset:** Vite
   - **Root Directory:** `/` (repo root — required for the pnpm monorepo)
   - **Build Command:** `pnpm turbo run build --filter=@vaultui/web`
   - **Output Directory:** `apps/web/dist`
4. **Add env vars** (Settings → Environment Variables):
   - `VITE_SUPABASE_URL` = your Supabase project URL (`https://<ref>.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` = your anon/public key
   - > The anon key is *designed* to be public — your security is in Supabase RLS,
     > not key secrecy. So `VITE_` prefix in the browser is fine.
5. Click **Deploy**. You're live at `https://vault-ui-<hash>.vercel.app`.

---

## Option B — Cloudflare Pages · ~10 minutes

Also free and auto-connects to GitHub. Unlimited bandwidth (Vercel's free tier has
100 GB/mo). The SPA fallback is already provided by `apps/web/public/_redirects`.

1. Push to GitHub (same as step 1 above).
2. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → Connect to Git.
3. Project settings:
   - **Build command:** `pnpm turbo run build --filter=@vaultui/web`
   - **Build output directory:** `apps/web/dist`
   - *Root directory*: leave the repo root selected (needed for the pnpm workspace).
4. Add the same two env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. **Save and Deploy.** Live at `https://<project>.pages.dev`.

> ⚠️ Cloudflare Pages installs dependencies at the repo root because it detects
> `pnpm-workspace.yaml`. If the install ever fails there, set the build command to
> `pnpm install --frozen-lockfile && pnpm turbo run build --filter=@vaultui/web`.

---

## Supabase — the "backend" (do this once)

1. Create a free project at https://supabase.com (password auth only — no phone needed).
2. Open **SQL Editor** → paste the entire contents of
   [`supabase/migrations/0001_profiles.sql`](supabase/migrations/0001_profiles.sql) → **Run**.
   This creates the `profiles` table, RLS policies, the `handle_new_user()` trigger,
   and the `grant_premium()` RPC the app calls on upgrade.
3. **Authentication → URL Configuration** (crucial, else email-verification links 404):
   - **Site URL:** your deployed frontend URL
     (e.g. `https://vault-ui-<hash>.vercel.app` — update this whenever you add a domain)
   - **Redirect URLs:** add the same URL.
4. Copy `Project Settings → API URL` + `anon public` key into the host's env vars (above).
5. Done — emails are sent by Supabase; your invite link → signup → confirm → premium flow
   all works against real PostgreSQL with RLS.

---

## What about running it locally? (the "server")

There is no server to boot — `pnpm --filter @vaultui/web dev` serves the SPA on
http://localhost:3000 (Vite). Production build: `pnpm --filter @vaultui/web build`
(→ `apps/web/dist`, already verified working).

---

## When you WILL need Render (later, optional)

Render's free tier (web service + Postgres, 750 hrs/mo) becomes useful when you add
server-side logic that Supabase can't do:

- **Stripe checkout/webhook** for real premium payments (`grant_premium` is already
  designed to be called from a trusted webhook, not the browser).
- **Server-side secrets** (API keys that must never reach the browser).
- **Cron jobs, scraping, custom email, file processing.**

For now the honest answer is: a Render deployment would be an empty process
consuming your 750 free hours. Deploy it the day you add the Stripe webhook.

---

## Verified locally ✅

- `pnpm --filter @vaultui/web build` → success (React SPA, ~227 KB gzip)
- `vite preview` → HTTP 200 at `/`
- SPA routes (`/docs/*`, `/sign-in`) are covered by `vercel.json` rewrites and the
  Cloudflare `_redirects` fallback.
---

## 🔄 Automatic updates — Vercel + Supabase on every push

Push to `main` and everything deploys itself:

| Trigger (push to `main`) | What runs |
| ------------------------ | --------- |
| any commit               | **CI** — lint · typecheck · build (`ci.yml`) |
| any commit               | **Vercel** — production deploy (`deploy-vercel.yml`) |
| `supabase/migrations/**` change | **Supabase** — `supabase db push` applies migrations (`deploy-supabase.yml`) |

### One-time setup — add GitHub secrets
Repo → **Settings → Secrets and variables → Actions** → New repository secret:

- **Vercel** (get token at vercel.com → Settings → Tokens; org/project ids in `.vercel/project.json` or Vercel dashboard):
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID` = `team_AUBM80VNTfvdtVS2YJ9z0uAV` (or your team id)
  - `VERCEL_PROJECT_ID` = `prj_ZypCaj2XzOPfKimFzVPFYG8aw9Md` (or your project id)
- **Supabase** (dashboard → Account → Access tokens; project ref = the `<ref>` in `https://<ref>.supabase.co`):
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_PROJECT_ID`
  - `SUPABASE_DB_PASSWORD`

The workflows are guarded with `if:` on those secrets — CI never fails before
you add them; deploys start automatically the moment they exist.

> **Vercel alternative:** if you've already imported the repo on
> vercel.com, its own GitHub integration deploys on push without this
> workflow — either path works; having both is harmless.
