import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "@vaultui/ui";
import { CopyPlus, FolderPlus, Pencil, Plus, Trash2 } from "lucide-react";
import { DocsHeader } from "../layout/DocsHeader";
import { useAuth } from "../auth/AuthContext";
import { useProjects } from "./ProjectContext";
import { ALL_DASHBOARDS, ALL_COMPONENTS } from "./entries";
import type { UserProject } from "./types";

type ModalState =
  | { kind: "create" }
  | { kind: "rename"; project: UserProject }
  | { kind: "delete"; project: UserProject }
  | null;

/** /projects — the user's workspace: create, open, rename, duplicate, delete. */
export function ProjectsPage() {
  const { isPremium } = useAuth();
  const {
    projects,
    loading,
    createProject,
    renameProject,
    deleteProject,
    duplicateProject,
    setActiveProject,
    countInProject,
  } = useProjects();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalState>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const openProject = (p: UserProject) => {
    setActiveProject(p.id);
    navigate(`/projects/${p.id}`);
  };

  const browseWith = (p: UserProject) => {
    setActiveProject(p.id);
    navigate("/docs");
  };

  const submitCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const p = await createProject(name);
      setModal(null);
      setName("");
      // Per the flow: after naming, land on the vault to start adding components.
      void p;
      navigate("/docs");
    } finally {
      setBusy(false);
    }
  };

  const submitRename = async (e: FormEvent) => {
    e.preventDefault();
    if (modal?.kind !== "rename" || !name.trim() || busy) return;
    setBusy(true);
    try {
      await renameProject(modal.project.id, name);
      setModal(null);
      setName("");
    } finally {
      setBusy(false);
    }
  };

  const submitDelete = async () => {
    if (modal?.kind !== "delete" || busy) return;
    setBusy(true);
    try {
      await deleteProject(modal.project.id);
      setModal(null);
    } finally {
      setBusy(false);
    }
  };

  const openCreate = () => {
    setName("");
    setModal({ kind: "create" });
  };

  const openRename = (p: UserProject) => {
    setName(p.name);
    setModal({ kind: "rename", project: p });
  };

  const openDelete = (p: UserProject) => setModal({ kind: "delete", project: p });

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <DocsHeader
        componentTotal={ALL_COMPONENTS.length - 1}
        dashboardTotal={ALL_DASHBOARDS.length}
        onOpenDrawer={() => undefined}
      />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your projects</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-surface-500">
              A project is your curated kit — add components from the vault, then download the exact
              selection as a themed bundle, with its own install command.
            </p>
          </div>
          <Button size="lg" onClick={openCreate} leadingIcon={<Plus className="size-4" />}>
            New project
          </Button>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-surface-400">Loading your projects…</p>
        ) : projects.length === 0 ? (
          <Card padding="lg" className="mt-10 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 shadow-inset">
              <FolderPlus className="size-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">Nothing here yet</h2>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-surface-500">
              Create your first project, then browse the vault and add the components you want — the
              kit builds itself.
            </p>
            <Button className="mt-5" onClick={openCreate} leadingIcon={<Plus className="size-4" />}>
              Create your first project
            </Button>
          </Card>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const count = countInProject(p.id);
              const dashboards = p.items.filter((i) => i.kind === "dashboard").length;
              const components = count - dashboards;
              return (
                <Card key={p.id} padding="lg" hover className="flex flex-col transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 shadow-inset">
                      <FolderPlus className="size-5" />
                    </span>
                    <Badge variant={components > 0 ? "success" : "neutral"} size="sm" dot>
                      {count === 0
                        ? "empty"
                        : `${components} component${components === 1 ? "" : "s"}${dashboards ? ` · ${dashboards} tmpl${dashboards === 1 ? "" : "s"}` : ""}`}
                    </Badge>
                  </div>
                  <h3 className="mt-3 truncate text-base font-semibold tracking-tight" title={p.name}>
                    {p.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-surface-400">
                    {new Date(p.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {isPremium ? "" : " · free plan"}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <Button size="sm" onClick={() => browseWith(p)} leadingIcon={<FolderPlus className="size-4" />}>
                      Browse & add components
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openProject(p)}>
                      Open project overview
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center gap-1 border-t border-surface-100 pt-3">
                    <button
                      type="button"
                      onClick={() => browseWith(p)}
                      title="Add from the vault"
                      className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-700"
                    >
                      <FolderPlus className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openRename(p)}
                      title="Rename"
                      className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-700"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const copy = await duplicateProject(p.id);
                        if (copy) openProject(copy);
                      }}
                      title="Duplicate"
                      className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-700"
                    >
                      <CopyPlus className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDelete(p)}
                      title="Delete"
                      className="ml-auto rounded-lg p-2 text-surface-400 transition-colors hover:bg-danger-500/10 hover:text-danger-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Create / rename */}
      {(modal?.kind === "create" || modal?.kind === "rename") && (
        <ModalOverlay onClose={() => setModal(null)}>
          <h2 className="text-lg font-semibold tracking-tight">
            {modal.kind === "create" ? "New project" : `Rename “${modal.project.name}”`}
          </h2>
          <p className="mt-1 text-sm text-surface-500">
            {modal.kind === "create"
              ? "Name it — you can always rename later. Next step: pick components in the vault."
              : "Give this project a fresh name."}
          </p>
          <form onSubmit={modal.kind === "create" ? submitCreate : submitRename} className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-surface-400">
                Project name
              </span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Customer dashboard"
                className="h-11 w-full rounded-xl border-0 bg-surface-100 px-3 text-sm text-surface-800 shadow-inset outline-none placeholder:text-surface-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy || !name.trim()} loading={busy}>
                {modal.kind === "create" ? "Create project" : "Save"}
              </Button>
            </div>
          </form>
        </ModalOverlay>
      )}

      {/* Delete confirm */}
      {modal?.kind === "delete" && (
        <ModalOverlay onClose={() => setModal(null)}>
          <h2 className="text-lg font-semibold tracking-tight">Delete “{modal.project.name}”?</h2>
          <p className="mt-1 text-sm leading-relaxed text-surface-500">
            This removes the project and every component you added to it. This can't be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={submitDelete} disabled={busy} loading={busy}>
              Delete project
            </Button>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

/** Small centered modal with a dimmed backdrop. */
function ModalOverlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-surface-950/40 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-raised animate-rise">
        {children}
      </div>
    </div>
  );
}