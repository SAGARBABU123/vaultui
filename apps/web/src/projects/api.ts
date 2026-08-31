import { getSupabase } from "../auth/supabase";
import type { AuthMode } from "../auth/AuthContext";
import type { UserProject } from "./types";

/**
 * Project persistence — same two-engine pattern as auth:
 *
 *  MOCK (no keys):  localStorage `vault-ui-projects`, keyed by user id.
 *  SUPABASE (keys): `projects` + `project_items` tables (migration 0002),
 *                   RLS owner-only, synced whole-shelf per mutation.
 *
 * Persisting the whole shelf on every mutation keeps the two engines
 * behaviorally identical (and is trivially consistent for this scale).
 */

const PROJECTS_KEY = "vault-ui-projects";
const ACTIVE_KEY = "vault-ui-active-project";

/* --------------------------------- utils -------------------------------- */

export function newProjectId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `p_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  }
}

/* ----------------------------- mock storage ----------------------------- */

function readMockProjects(): Record<string, UserProject[]> {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? "{}") as Record<string, UserProject[]>;
  } catch {
    return {};
  }
}

/* --------------------------- active project id -------------------------- */

export function readActiveProjectId(userId: string): string | null {
  try {
    const map = JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? "{}") as Record<string, string | null>;
    return map[userId] ?? null;
  } catch {
    return null;
  }
}

export function writeActiveProjectId(userId: string, projectId: string | null) {
  try {
    const map = JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? "{}") as Record<string, string | null>;
    map[userId] = projectId;
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/* --------------------------------- api ---------------------------------- */

export interface ProjectAPI {
  load(userId: string): Promise<UserProject[]>;
  /** Replace the user's whole shelf (create / rename / delete / add / remove). */
  persist(userId: string, projects: UserProject[]): Promise<void>;
  /** Flip the public-share flag on one project. */
  setShared(userId: string, projectId: string, shared: boolean): Promise<void>;
  /** Public read for kit/:id — shared projects only. */
  loadPublic(projectId: string): Promise<UserProject | null>;
}

class MockProjectAPI implements ProjectAPI {
  async load(userId: string): Promise<UserProject[]> {
    return readMockProjects()[userId] ?? [];
  }
  async persist(userId: string, projects: UserProject[]) {
    const map = readMockProjects();
    map[userId] = projects;
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(map));
    } catch {
      /* quota — keep state in memory */
    }
  }
  async setShared(userId: string, projectId: string, shared: boolean) {
    const map = readMockProjects();
    const list = (map[userId] ?? []).map((p) =>
      p.id === projectId ? { ...p, isShared: shared } : p,
    );
    map[userId] = list;
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(map));
    } catch {
      /* ignore */
    }
  }
  async loadPublic(projectId: string): Promise<UserProject | null> {
    const map = readMockProjects();
    for (const list of Object.values(map)) {
      const p = list.find((x) => x.id === projectId && x.isShared);
      if (p) return p;
    }
    return null;
  }
}

interface DbProject {
  id: string;
  name: string;
  theme_id: string;
  created_at: string;
  updated_at: string;
  is_shared: boolean;
  project_items: DbItem[];
}

interface DbItem {
  id: string;
  component_id: string;
  kind: "component" | "dashboard";
  name: string;
  pkg: string | null;
  pkg_list: string[] | null;
  tier: "free" | "paid";
  added_at: string;
}

function toUserProject(row: DbProject): UserProject {
  return {
    id: row.id,
    name: row.name,
    themeId: row.theme_id,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    isShared: Boolean(row.is_shared),
    items: (row.project_items ?? []).map((i) => ({
      id: i.component_id,
      kind: i.kind,
      name: i.name,
      pkg: i.pkg,
      pkgList: i.pkg_list ?? [],
      tier: i.tier,
      addedAt: new Date(i.added_at).getTime(),
    })),
  };
}

class SupabaseProjectAPI implements ProjectAPI {
  private get db() {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase project API used without keys");
    return supabase;
  }

  async load(userId: string): Promise<UserProject[]> {
    const { data, error } = await this.db
      .from("projects")
      .select("*, project_items(*)")
      .eq("owner_id", userId)
      .order("created_at");
    if (error) throw error;
    return (data as unknown as DbProject[] | null)?.map(toUserProject) ?? [];
  }

  async persist(userId: string, projects: UserProject[]) {
    const supabase = this.db;

    // Whole-shelf rewrite — delete owned rows, then re-insert (cascade cleans items).
    const { error: delErr } = await supabase.from("projects").delete().eq("owner_id", userId);
    if (delErr) throw delErr;

    if (projects.length === 0) return;

    const { error: insErr } = await supabase.from("projects").insert(
      projects.map((p) => ({
        id: p.id,
        owner_id: userId,
        name: p.name,
        theme_id: p.themeId,
        is_shared: p.isShared ?? false,
        created_at: new Date(p.createdAt).toISOString(),
        updated_at: new Date(p.updatedAt).toISOString(),
      })),
    );
    if (insErr) throw insErr;

    const items: Record<string, unknown>[] = [];
    for (const p of projects) {
      for (const i of p.items) {
        items.push({
          owner_id: userId,
          project_id: p.id,
          component_id: i.id,
          kind: i.kind,
          name: i.name,
          pkg: i.pkg,
          pkg_list: i.pkgList,
          tier: i.tier,
          added_at: new Date(i.addedAt).toISOString(),
        });
      }
    }
    if (items.length === 0) return;

    // Insert in one batch (project_items has no generated key — row id = component id).
    const { error: itemErr } = await supabase.from("project_items").insert(items);
    if (itemErr) throw itemErr;
  }

  async setShared(userId: string, projectId: string, shared: boolean) {
    const { error } = await this.db
      .from("projects")
      .update({ is_shared: shared })
      .eq("id", projectId)
      .eq("owner_id", userId);
    if (error) throw error;
  }

  async loadPublic(projectId: string): Promise<UserProject | null> {
    const { data, error } = await this.db
      .from("projects")
      .select("*, project_items(*)")
      .eq("id", projectId)
      .eq("is_shared", true)
      .maybeSingle();
    if (error || !data) return null;
    return toUserProject(data as unknown as DbProject);
  }
}

/* -------------------------------- factory -------------------------------- */

let cached: ProjectAPI | null = null;

export function getProjectAPI(mode: AuthMode): ProjectAPI {
  // Supabase mode only when keys exist (same rule as auth).
  const supabase = getSupabase();
  if (mode === "supabase" && supabase) {
    if (!(cached instanceof SupabaseProjectAPI)) cached = new SupabaseProjectAPI();
    return cached;
  }
  if (!(cached instanceof MockProjectAPI)) cached = new MockProjectAPI();
  return cached;
}