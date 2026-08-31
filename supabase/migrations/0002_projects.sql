-- Vault UI — projects schema (run via `supabase db push` or the SQL editor).
-- Apply AFTER 0001_profiles.sql.
--
-- Projects are the user's curated kit: components (and dashboard templates)
-- added to a project become downloadable as a themed bundle. RLS is
-- owner-only; all writes go through the app (whole-shelf sync per mutation).

-- 1. Projects — one per curated kit.
create table if not exists public.projects (
  id uuid primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  theme_id text not null default 'neumorphic',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "owner manages projects" on public.projects
  for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- 2. Project items — component/dashboard refs in the cart.
create table if not exists public.project_items (
  owner_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  component_id text not null,
  kind text not null default 'component' check (kind in ('component', 'dashboard')),
  name text not null,
  pkg text,
  pkg_list jsonb not null default '[]'::jsonb,
  tier text not null default 'paid' check (tier in ('free', 'paid')),
  added_at timestamptz not null default now(),
  primary key (project_id, component_id)
);

alter table public.project_items enable row level security;

create policy "owner manages project items" on public.project_items
  for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Convenience: authenticated users need the base privileges RLS filters on.
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_items to authenticated;