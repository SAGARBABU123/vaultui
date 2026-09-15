import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import { Button } from "@vaultui/ui";
import { useAuth } from "../auth/AuthContext";
import type { ComponentEntry, DashboardEntry } from "../docs/types";
// NOTE: `./entries` is NOT imported here — ProjectContext mounts on every
// route (incl. the landing page) and entries pulls the full registry + kit.
// toggleItem resolves it lazily via import("./entries").
import { getProjectAPI, newProjectId, readActiveProjectId, writeActiveProjectId } from "./api";
import type { ProjectItemMeta, UserProject } from "./types";

export interface ProjectToast {
  componentName: string;
  projectId: string;
  projectName: string;
}

interface ProjectContextValue {
  projects: UserProject[];
  activeProject: UserProject | null;
  activeProjectId: string | null;
  loading: boolean;
  /** Create a project, make it active, and return it (caller navigates). */
  createProject: (name: string) => Promise<UserProject>;
  renameProject: (projectId: string, name: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (projectId: string) => Promise<UserProject>;
  setActiveProject: (projectId: string | null) => void;
  /** Toggle the entry in the active project (add if absent, remove if present). */
  toggleItem: (entryId: string) => void;
  removeItem: (projectId: string, itemId: string) => void;
  /** True when the entry is already in the active project. */
  isInActiveProject: (entryId: string) => boolean;
  countInProject: (projectId: string) => number;
  /** Enable/disable the public share link. */
  setProjectShared: (projectId: string, shared: boolean) => Promise<void>;
  toast: ProjectToast | null;
  dismissToast: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

/** Snapshot a registry entry into storable item metadata (no React nodes). */
function snapshotItem(entry: ComponentEntry | DashboardEntry | null): ProjectItemMeta | null {
  if (!entry) return null;
  if (entry.kind === "dashboard") {
    return {
      id: entry.id,
      kind: "dashboard",
      name: entry.name,
      pkg: null,
      pkgList: entry.packages,
      tier: "paid",
      addedAt: Date.now(),
    };
  }
  return {
    id: entry.id,
    kind: "component",
    name: entry.name,
    pkg: entry.package,
    pkgList: entry.package === "—" ? [] : [entry.package],
    tier: entry.tier,
    addedAt: Date.now(),
  };
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { mode, user } = useAuth();
  const navigate = useNavigate();
  const api = getProjectAPI(mode);

  const [projects, setProjects] = useState<UserProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ProjectToast | null>(null);
  const toastTimer = useRef<number | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;

  /* --------------------------- session bootstrap -------------------------- */
  useEffect(() => {
    let alive = true;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);

    (async () => {
      if (!user) {
        setProjects([]);
        setActiveProjectId(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const list = await api.load(user.id);
        if (!alive) return;
        setProjects(list);
        const stored = readActiveProjectId(user.id);
        const target = list.find((p) => p.id === stored)?.id ?? list[0]?.id ?? null;
        setActiveProjectId(target);
        if (target) writeActiveProjectId(user.id, target);
      } catch {
        /* storage unavailable — start empty */
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, mode]);

  /* ------------------------------- commit -------------------------------- */

  const commit = useCallback(
    async (next: UserProject[]) => {
      setProjects(next);
      if (!user) return;
      try {
        await api.persist(user.id, next);
      } catch {
        /* keep in-memory state — storage write failed */
      }
    },
    [api, user],
  );

  /* ------------------------------- toasts -------------------------------- */

  const showToast = useCallback((t: ProjectToast) => {
    setToast(t);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 5000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  /* ------------------------------- actions ------------------------------- */

  const createProject = useCallback(
    async (name: string): Promise<UserProject> => {
      const trimmed = name.trim() || "Untitled project";
      const project: UserProject = {
        id: newProjectId(),
        name: trimmed,
        themeId: "neumorphic",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isShared: false,
        items: [],
      };
      const next = [project, ...projects];
      setActiveProjectId(project.id);
      if (user) writeActiveProjectId(user.id, project.id);
      await commit(next);
      return project;
    },
    [projects, commit, user],
  );

  const renameProject = useCallback(
    async (projectId: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const next = projects.map((p) =>
        p.id === projectId ? { ...p, name: trimmed, updatedAt: Date.now() } : p,
      );
      await commit(next);
    },
    [projects, commit],
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      const next = projects.filter((p) => p.id !== projectId);
      setActiveProjectId((prev) => {
        const target = prev === projectId ? (next[0]?.id ?? null) : prev;
        if (user) writeActiveProjectId(user.id, target);
        return target;
      });
      await commit(next);
    },
    [projects, commit, user],
  );

  const duplicateProject = useCallback(
    async (projectId: string): Promise<UserProject> => {
      const src = projects.find((p) => p.id === projectId);
      if (!src) throw new Error("Project not found");
      const copy: UserProject = {
        ...src,
        id: newProjectId(),
        name: `${src.name} (copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        items: src.items.map((i) => ({ ...i, addedAt: Date.now() })),
      };
      const next = [copy, ...projects];
      await commit(next);
      return copy;
    },
    [projects, commit],
  );

  const setActiveProject = useCallback(
    (projectId: string | null) => {
      setActiveProjectId(projectId);
      if (user) writeActiveProjectId(user.id, projectId);
    },
    [user],
  );

  const toggleItem = useCallback(
    (entryId: string) => {
      // No active project → send the user to pick/create one first.
      if (!activeProject) {
        navigate("/projects");
        return;
      }

      const existing = activeProject.items.find((i) => i.id === entryId);
      if (existing) {
        const next = projects.map((p) =>
          p.id === activeProject.id
            ? {
                ...p,
                updatedAt: Date.now(),
                items: p.items.filter((i) => i.id !== entryId),
              }
            : p,
        );
        void commit(next);
        return;
      }

      // Add path loads the registry lazily (keeps the whole kit out of the
      // main bundle — ProjectContext mounts on every route).
      void import("./entries").then(({ entryById }) => {
        const meta = snapshotItem(entryById(entryId));
        if (!meta) return;
        const next = projects.map((p) =>
          p.id === activeProject.id ? { ...p, updatedAt: Date.now(), items: [...p.items, meta] } : p,
        );
        void commit(next);
        showToast({ componentName: meta.name, projectId: activeProject.id, projectName: activeProject.name });
      });
    },
    [activeProject, projects, commit, navigate, showToast],
  );

  const removeItem = useCallback(
    (projectId: string, itemId: string) => {
      const next = projects.map((p) =>
        p.id === projectId ? { ...p, updatedAt: Date.now(), items: p.items.filter((i) => i.id !== itemId) } : p,
      );
      void commit(next);
    },
    [projects, commit],
  );

  const isInActiveProject = useCallback(
    (entryId: string) => activeProject?.items.some((i) => i.id === entryId) ?? false,
    [activeProject],
  );

  const countInProject = useCallback(
    (projectId: string) => projects.find((p) => p.id === projectId)?.items.length ?? 0,
    [projects],
  );

  const setProjectShared = useCallback(
    async (projectId: string, shared: boolean) => {
      if (!user) return;
      const next = projects.map((p) => (p.id === projectId ? { ...p, isShared: shared } : p));
      setProjects(next);
      try {
        await api.setShared(user.id, projectId, shared);
      } catch {
        /* keep in-memory state */
      }
    },
    [projects, user, api],
  );

  const value: ProjectContextValue = {
    projects,
    activeProject,
    activeProjectId,
    loading,
    createProject,
    renameProject,
    deleteProject,
    duplicateProject,
    setActiveProject,
    toggleItem,
    removeItem,
    isInActiveProject,
    countInProject,
    setProjectShared,
    toast,
    dismissToast,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}

      {/* Add-to-project toast — bottom-right, with a View-project shortcut */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-3 pr-4 shadow-raised animate-rise"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-500/15 text-success-600">
            {toast ? <Check className="size-5" /> : <Plus className="size-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-surface-900">{toast.componentName}</p>
            <p className="truncate text-xs text-surface-500">
              Added to <span className="font-medium text-surface-700">{toast.projectName}</span>
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              dismissToast();
              navigate(`/projects/${toast.projectId}`);
            }}
          >
            View project
          </Button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismissToast}
            className="rounded-md p-1 text-surface-400 transition-colors hover:text-surface-700"
          >
            ✕
          </button>
        </div>
      )}
    </ProjectContext.Provider>
  );
}

export function useProjects(): ProjectContextValue {
  const value = useContext(ProjectContext);
  if (!value) throw new Error("useProjects must be used within <ProjectProvider>");
  return value;
}