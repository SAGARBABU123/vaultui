-- Vault UI — project sharing (run via `supabase db push` or the SQL editor).
-- Apply AFTER 0003_onboarding.sql.
--
-- Kit pages at /kit/:id are readable without login by anyone, but ONLY when
-- the owner flipped `is_shared` on (the overview's "Share kit" toggle).

alter table public.projects
  add column if not exists is_shared boolean not null default false;

-- Anyone (including anon) can read a project that was explicitly shared.
create policy "view shared kits" on public.projects
  for select to anon, authenticated
  using (is_shared = true);

-- Item rows follow their project: public readers see them via the join.
create policy "view shared kit items" on public.project_items
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_items.project_id and p.is_shared = true
    )
  );