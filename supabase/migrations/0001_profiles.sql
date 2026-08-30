-- Vault UI — Supabase schema (run in the Supabase SQL editor or via `supabase db push`).
-- Apply BEFORE switching the app to Supabase auth mode.

-- 1. Profiles: one row per auth user, RLS-protected. Role is NOT writable
--    by clients — only the `grant_premium()` security-definer function may
--    change it (called from the app's "Upgrade (demo)" / future Stripe hook).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'free' check (role in ('free', 'premium')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Owner reads their own row (drives the free/premium gate in the UI).
create policy "read own profile" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

-- No client-side inserts/updates/deletes — grants go through the function.
revoke all on public.profiles from anon;
-- Authenticated users still need the base SELECT privilege; RLS then filters
-- each row via the policy below (privileges gate access, RLS gates rows).
grant select on public.profiles to authenticated;

-- 2. Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Premium grant — security definer, callable as supabase.rpc("grant_premium").
--    Idempotent: upgrading an already-premium account is a no-op.
create or replace function public.grant_premium()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles set role = 'premium' where id = auth.uid();
$$;

-- Convenience reads for dashboards/tooling (optional).
grant execute on function public.grant_premium() to authenticated;