import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card } from "@vaultui/ui";
import { Check, Copy, Download, Folder, Package, Sparkles } from "lucide-react";
import { DocsHeader } from "../layout/DocsHeader";
import { useAuth } from "../auth/AuthContext";
import { getProjectAPI } from "./api";
import { ALL_COMPONENTS, ALL_DASHBOARDS, ENTRY_BY_ID, GROUP_NAME_BY_ID } from "./entries";
import { buildInstallCommand, downloadProjectSelection } from "../docs/downloadKit";
import type { ComponentEntry } from "../docs/types";
import type { UserProject } from "./types";

/**
 * /kit/:id — public read-only view of a shared project kit.
 * No login required; download + install command available to anyone who has
 * the link (data via mock localStorage in demo mode, RLS-guarded rows in
 * Supabase mode via migration 0004).
 */
export function ShareKitPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode, isSignedIn } = useAuth();
  const [project, setProject] = useState<UserProject | null | "loading">("loading");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!id) {
      setProject(null);
      return;
    }
    getProjectAPI(mode)
      .loadPublic(id)
      .then((p) => {
        if (alive) setProject(p);
      })
      .catch(() => {
        if (alive) setProject(null);
      });
    return () => {
      alive = false;
    };
  }, [id, mode]);

  const groups = useMemo(() => {
    const map = new Map<string, UserProject["items"]>();
    if (!project || project === "loading") return map;
    for (const item of project.items) {
      const group =
        GROUP_NAME_BY_ID.get(item.id) ??
        (item.kind === "dashboard" ? "Dashboard Templates" : (item.pkg ?? "Other"));
      const list = map.get(group);
      if (list) list.push(item);
      else map.set(group, [item]);
    }
    return map;
  }, [project]);

  if (project === "loading") {
    return (
      <Shell onLogo={() => navigate("/")}>
        <p className="text-sm text-surface-400">Loading kit…</p>
      </Shell>
    );
  }

  if (!project) {
    return (
      <Shell onLogo={() => navigate("/")}>
        <Card padding="lg" className="mx-auto max-w-md text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-surface-100 text-surface-400">
            <Folder className="size-6" />
          </span>
          <h1 className="mt-4 text-lg font-semibold tracking-tight">This kit isn't shared</h1>
          <p className="mt-1 text-sm leading-relaxed text-surface-500">
            The owner hasn't shared it, or it was unshared since.
          </p>
          <Button className="mt-5" onClick={() => navigate("/")}>
            Back to Vault UI
          </Button>
        </Card>
      </Shell>
    );
  }

  const componentIds = project.items.filter((i) => i.kind === "component").map((i) => i.id);
  const dashboardIds = project.items.filter((i) => i.kind === "dashboard").map((i) => i.id);
  const dashCount = dashboardIds.length;
  const compCount = componentIds.length;
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
      .map((cid) => entryOf(cid))
      .filter((e): e is ComponentEntry => e !== null);
    try {
      await navigator.clipboard.writeText(buildInstallCommand(entries));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <Shell onLogo={() => navigate("/")}>
      {/* Kit header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand-600" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
              Shared kit
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{project.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-500">
            A curated Vault UI kit — {compCount} component{compCount === 1 ? "" : "s"}
            {dashCount ? ` + ${dashCount} dashboard template${dashCount === 1 ? "" : "s"}` : ""}
            {paidCount ? ` · ${paidCount} paid kit${paidCount === 1 ? "" : "s"}` : ""}, ready to drop into your product.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloading || project.items.length === 0}
            leadingIcon={downloading ? <Package className="size-4 animate-pulse" /> : <Download className="size-4" />}
          >
            {downloading ? "Packing zip…" : "Download kit (.zip)"}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCopyCommand} disabled={componentIds.length === 0} leadingIcon={copied ? <Check className="size-4 text-success-500" /> : <Copy className="size-4" />}>
            {copied ? "Copied!" : "Copy install command"}
          </Button>
        </div>
      </div>

      {/* Items */}
      {project.items.length === 0 ? (
        <Card padding="lg" className="mt-8 text-center">
          <p className="text-sm text-surface-500">This kit is empty — nothing to preview yet.</p>
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
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-surface-900">{item.name}</p>
                      <p className="truncate font-mono text-[11px] text-surface-400">
                        {item.kind === "dashboard" ? `template · ${item.pkgList.join(", ")}` : item.pkg === "—" ? "core" : item.pkg}
                      </p>
                    </div>
                    <Badge variant={item.tier === "free" ? "success" : "brand"} size="sm">
                      {item.kind === "dashboard" ? "template" : item.tier === "free" ? "free" : "paid"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-5 text-center">
        <p className="text-sm leading-relaxed text-surface-600">
          {isSignedIn ? (
            <>Want to share your own kit? It's the same three steps — create a project, add components, hit share.</>
          ) : (
            <>
              <span className="font-semibold text-brand-700">Like what you see?</span> Sign in free to build
              your own kit — create a project, add components, and share it publicly.
            </>
          )}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Button size="sm" onClick={() => navigate(isSignedIn ? "/projects" : "/sign-up")}>
            {isSignedIn ? "Open my projects" : "Create a free account"}
          </Button>
          {!isSignedIn && (
            <Button size="sm" variant="ghost" onClick={() => navigate("/sign-in")}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children, onLogo }: { children: React.ReactNode; onLogo: () => void }) {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <DocsHeader
        componentTotal={ALL_COMPONENTS.length - 1}
        dashboardTotal={ALL_DASHBOARDS.length}
        onOpenDrawer={() => undefined}
      />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}

/** Resolve a component entry by id (public page needs no demo — metadata only). */
function entryOf(id: string) {
  // Reuse the shared entry map without pulling React demos into the public page.
  return ComponentsById.get(id) ?? null;
}

const ComponentsById = ENTRY_BY_ID as unknown as Map<string, ComponentEntry>;