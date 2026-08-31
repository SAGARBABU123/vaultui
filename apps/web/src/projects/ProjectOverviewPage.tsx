import { useMemo, useState, type ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card } from "@vaultui/ui";
import { Check, Copy, Crown, Download, FolderPlus, Package, Plus, Trash2 } from "lucide-react";
import { DocsHeader } from "../layout/DocsHeader";
import { useAuth } from "../auth/AuthContext";
import { useProjects } from "./ProjectContext";
import { ALL_DASHBOARDS, ALL_COMPONENTS, GROUP_NAME_BY_ID, entryById } from "./entries";
import { buildInstallCommand, downloadProjectSelection } from "../docs/downloadKit";
import type { ComponentEntry } from "../docs/types";
import type { UserProject } from "./types";

/** /projects/:id — the curated kit: review, remove, download, add more. */
export function ProjectOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, activeProjectId, loading, removeItem, deleteProject, setActiveProject } = useProjects();
  const { isPremium, upgrade } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const project = projects.find((p) => p.id === id) ?? null;

  // Group items by kit for a clean review list.
  const groups = useMemo(() => {
    const map = new Map<string, UserProject["items"]>();
    for (const item of project?.items ?? []) {
      const group =
        GROUP_NAME_BY_ID.get(item.id) ??
        (item.kind === "dashboard" ? "Dashboard Templates" : (item.pkg ?? "Other"));
      const list = map.get(group);
      if (list) list.push(item);
      else map.set(group, [item]);
    }
    return map;
  }, [project]);

  if (loading) {
    return (
      <PageShell onLogo={() => navigate("/")}>
        <p className="text-sm text-surface-400">Loading project…</p>
      </PageShell>
    );
  }

  if (!project) return <Navigate to="/projects" replace />;

  const componentIds = project.items.filter((i) => i.kind === "component").map((i) => i.id);
  const dashboardIds = project.items.filter((i) => i.kind === "dashboard").map((i) => i.id);
  const entryCount = project.items.length;
  const paidCount = project.items.filter((i) => i.tier === "paid").length;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadProjectSelection(componentIds, dashboardIds, project.name);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyCommand = async () => {
    const entries = componentIds
      .map((cid) => entryById(cid))
      .filter((e): e is ComponentEntry => e !== null && e.kind !== "dashboard");
    const command = buildInstallCommand(entries);
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <PageShell onLogo={() => navigate("/")}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">{project.name}</h1>
            <Badge variant={entryCount > 0 ? "brand" : "neutral"} size="sm" dot>
              {entryCount === 0 ? "empty" : `${entryCount} item${entryCount === 1 ? "" : "s"}`}
            </Badge>
            {paidCount > 0 && (
              <Badge variant="warning" size="sm">
                {paidCount} paid kit{paidCount === 1 ? "" : "s"}
              </Badge>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-500">
            {entryCount === 0
              ? "No components yet — add some from the vault and this page becomes your kit."
              : "Your curated kit — download exactly these components with the theme bundled, or copy the install command for just what you picked."}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={handleDownload} disabled={downloading || entryCount === 0} leadingIcon={downloading ? <Package className="size-5 animate-pulse" /> : <Download className="size-5" />}>
          {downloading ? "Packing zip…" : "Download kit (.zip)"}
        </Button>
        <Button size="lg" variant="secondary" onClick={handleCopyCommand} disabled={componentIds.length === 0} leadingIcon={copied ? <Check className="size-5 text-success-500" /> : <Copy className="size-5" />}>
          {copied ? "Copied!" : "Copy install command"}
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => {
            setActiveProject(project.id);
            navigate("/docs");
          }}
          leadingIcon={<Plus className="size-5" />}
        >
          Add more components
        </Button>
      </div>

      {/* Premium notice */}
      {paidCount > 0 && !isPremium && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-warning-300 bg-warning-50/60 p-4">
          <p className="flex items-center gap-2 text-sm text-surface-600">
            <Crown className="size-4 shrink-0 text-warning-500" />
            This project includes paid-kit components. The zip ships the theme + free core; paid kit
            code unlocks with the premium license.
          </p>
          <Button size="sm" variant="secondary" onClick={() => void upgrade()}>
            Upgrade (demo)
          </Button>
        </div>
      )}

      {/* Items */}
      {entryCount === 0 ? (
        <Card padding="lg" className="mt-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 shadow-inset">
            <FolderPlus className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight">This project is empty</h2>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-surface-500">
            Head to the vault and hit “Add to project” on the components you want in this kit.
          </p>
          <Button className="mt-5" onClick={() => navigate("/docs")} leadingIcon={<Plus className="size-4" />}>
            Browse components
          </Button>
        </Card>
      ) : (
        <div className="mt-8 space-y-6">
          {[...groups.entries()].map(([group, items]) => (
            <section key={group}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-400">{group}</h2>
                <span className="font-mono text-[11px] text-surface-400">{items.length}</span>
              </div>
              <ul className="divide-y divide-surface-100 overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-soft">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-50/30">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-surface-900">{item.name}</p>
                      <p className="truncate font-mono text-[11px] text-surface-400">
                        {item.kind === "dashboard"
                          ? `template · ${item.pkgList.join(", ")}`
                          : item.pkg === "—"
                            ? "core"
                            : item.pkg}
                      </p>
                    </div>
                    <Badge variant={item.tier === "free" ? "success" : "brand"} size="sm">
                      {item.kind === "dashboard" ? "template" : item.tier === "free" ? "free" : "paid"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => removeItem(project.id, item.id)}
                      aria-label={`Remove ${item.name} from ${project.name}`}
                      className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-danger-500/10 hover:text-danger-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Danger zone */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4">
        <div>
          <p className="text-sm font-semibold text-surface-800">Delete this project</p>
          <p className="text-xs text-surface-400">Removes the project and its item collection.</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={async () => {
            await deleteProject(project.id);
            if (activeProjectId === project.id) setActiveProject(projects[0]?.id ?? null);
            navigate("/projects");
          }}
        >
          Delete
        </Button>
      </div>
    </PageShell>
  );
}

/* ------------------------------- helpers -------------------------------- */

function PageShell({ children, onLogo }: { children: ReactNode; onLogo: () => void }) {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <DocsHeader
        componentTotal={ALL_COMPONENTS.length - 1}
        dashboardTotal={ALL_DASHBOARDS.length}
        onOpenDrawer={() => undefined}
        onLogo={onLogo}
      />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}