-- Vault UI — onboarding flag (run via `supabase db push` or the SQL editor).
-- Apply AFTER 0002_projects.sql.
--
-- `has_onboarded` lives on the user's own profiles row: the first-time guide
-- shows only on the very first login for that user, and logout → login (or a
-- new device) never replays it. The app reads it via the RLS-protected read
-- and updates it through a safe owner-scoped update.

alter table public.profiles
  add column if not exists has_onboarded boolean not null default false;

-- Owners may flip their own flag (single-column update; role stays protected).
create policy "owner updates onboarding" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);