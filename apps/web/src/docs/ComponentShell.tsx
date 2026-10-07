import { Badge, Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { ArrowRight, Check, Copy, Download, FolderPlus, Grab, Package, Plus, Star, Terminal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { INSTALL_COMMAND } from "../projects/counts";
import { InstallTabs } from "../components/InstallTabs";
import { downloadKit } from "./downloadKit";
import { Playground, PLAYGROUNDS, type PlaygroundBuilder } from "./Playground";
import { ThemeCompare } from "./ThemeCompare";
import { ThemeWall } from "./ThemeWall";
import { ComponentInsights } from "./ComponentInsights";
import { useFavorites } from "./favorites";
import { readRecents } from "./recents";
import { VaultLogo } from "../brand/VaultLogo";
import { useProjects } from "../projects/ProjectContext";
import { ALL_COMPONENTS, ALL_DASHBOARDS, ALL_GROUPS, entryById, GROUP_NAME_BY_ID } from "../projects/entries";
import type { ComponentEntry, DashboardEntry } from "./types";

type DemoView = "demo" | "playground" | "ab" | "wall";

export interface ComponentShellProps {
  entry: ComponentEntry | DashboardEntry;
  prev: ComponentEntry | DashboardEntry | null;
  next: ComponentEntry | DashboardEntry | null;
  onNavigate: (id: string) => void;
  /** Guideline ids are namespaced (/docs/guidelines/:id) — used by the overview strip. */
  onNavigateGuideline?: (id: string) => void;
  /** Number of component entries (overview excluded) — used for the overview copy. */
  componentTotal: number;
}

export function ComponentShell({ entry, prev, next, onNavigate, onNavigateGuideline, componentTotal }: ComponentShellProps) {
  const [view, setView] = useState<DemoView>("demo");
  useEffect(() => {
    const t = window.setTimeout(() => setView("demo"), 0);
    return () => window.clearTimeout(t);
  }, [entry.id]);

  const { projects } = useProjects();
  const navigate = useNavigate();
  const playground: PlaygroundBuilder | null = entry.kind === "dashboard" ? null : (PLAYGROUNDS[entry.id] ?? null);
  if (entry.id === "overview") {
    return (
      <article key={entry.id} className="animate-rise">
        <OverviewHero componentTotal={componentTotal} />
        <PersonalShortcuts onNavigate={onNavigate} />
        <section className="mt-8">
          <SectionLabel>At a glance</SectionLabel>
          <OverviewStats total={componentTotal + 1} />
        </section>
        <section className="mt-8">
          <SectionLabel>What's inside</SectionLabel>
          <KitGrid onNavigate={onNavigate} />
        </section>
        <section className="mt-8">
          <SectionLabel>Dashboard templates</SectionLabel>
          <DashStrip onNavigate={onNavigate} />
        </section>
        <section className="mt-8">
          <SectionLabel>Power tools</SectionLabel>
          <FeatureLinks navigate={navigate} />
        </section>
        {/* The do/don't playbook — the reference styles guide, now a vault product page */}
        {onNavigateGuideline && (
          <section className="mt-8">
            <SectionLabel>UI guidelines</SectionLabel>
            <GuidelinesStrip onNavigate={onNavigateGuideline} />
          </section>
        )}
        <section className="mt-8">
          <StartCard hasProjects={projects.length > 0} navigate={navigate} />
        </section>
      </article>
    );
  }

  // Dashboard templates get a full-page, themeable canvas.
  if (entry.kind === "dashboard") {
    return (
      <article key={entry.id} className="animate-rise">
        {/* Header */}
        <header className="border-b border-surface-200 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{entry.name}</h1>
            <Badge variant="brand" size="sm" dot>
              Dashboard template
            </Badge>
            <Badge variant="neutral" size="sm">Token-driven · all 4 themes</Badge>
            <div className="ml-auto flex items-center gap-2">
              <FavoriteButton entryId={entry.id} />
              <AddToProjectControl entryId={entry.id} />
            </div>
          </div>
          <p className="mt-2 max-w-2xl leading-relaxed text-surface-500">{entry.description}</p>
          {entry.packages.length > 0 && (
            <code className="mt-3 inline-block rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-1 font-mono text-xs text-surface-600">
              {entry.packages.join(" · ")}
            </code>
          )}
        </header>

        <SectionJump items={[{ id: "sec-preview", label: "Live preview" }]} />

        {/* Live preview — full-bleed composition, re-skins with the theme dropdown */}
        <section id="sec-preview" className="mt-6 scroll-mt-24">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <SectionLabel>Live preview</SectionLabel>
            <DemoViewChips view={view} onChange={setView} showPlayground={false} />
          </div>
          {view === "ab" ? (
            <ThemeCompare demo={entry.demo} />
          ) : view === "wall" ? (
            <ThemeWall demo={entry.demo} />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-surface-200 shadow-raised">{entry.demo}</div>
          )}
        </section>

        <CrossLinks entry={entry} onNavigate={onNavigate} />

        <PrevNext prev={prev} next={next} onNavigate={onNavigate} />
      </article>
    );
  }

  return (
    <article key={entry.id} className="animate-rise">
      {/* Header */}
      <header className="border-b border-surface-200 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{entry.name}</h1>
          {entry.id !== "overview" && (
            <Badge variant={entry.tier === "free" ? "success" : "brand"} size="sm" dot>
              {entry.tier === "free" ? "Free · MIT" : "Paid kit"}
            </Badge>
          )}
          {entry.id !== "overview" && (
            <div className="ml-auto flex items-center gap-2">
              <FavoriteButton entryId={entry.id} />
              <AddToProjectControl entryId={entry.id} />
            </div>
          )}
        </div>
        <p className="mt-2 max-w-2xl leading-relaxed text-surface-500">{entry.description}</p>
        {entry.id !== "overview" && <ComponentInsights entry={entry} />}
      </header>

      {entry.id !== "overview" && (
        <SectionJump
          items={[
            { id: "sec-grab", label: "React grab" },
            { id: "sec-usage", label: "Usage" },
            ...(entry.props.length > 0 ? [{ id: "sec-api", label: "API" }] : []),
            { id: "sec-demo", label: "Live demo" },
          ]}
        />
      )}

      {entry.id !== "overview" && (
        <>
          {/* React grab — select + comment + copy (first thing you see) */}
          <section id="sec-grab" className="mt-6 scroll-mt-24">
            <SectionLabel>React grab</SectionLabel>
            <p className="mb-3 text-sm leading-relaxed text-surface-500">
              Grab this component — type a comment and it gets dropped into the copied snippet.
            </p>
            <ReactGrab entry={entry} />
          </section>

          {/* Usage */}
          <section id="sec-usage" className="mt-8 scroll-mt-24">
            <SectionLabel>Usage</SectionLabel>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-surface-200/70 bg-surface-0 p-4">
                <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-surface-400">Install</p>
                <InstallTabs packages={[entry.package]} compact />
                <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-surface-400">
                  <Terminal className="size-3.5" />
                  preferred: <code className="text-brand-600">npx vault-ui add {entry.id}</code>
                </p>
              </div>
              <CodeBlock
                title="Import & use"
                code={`import ${entry.importName} from "${entry.package}";\n\n${entry.usage}`}
              />
            </div>
          </section>
        </>
      )}

      {/* API */}
      {entry.props.length > 0 && (
        <section id="sec-api" className="mt-8 scroll-mt-24">
          <SectionLabel>API</SectionLabel>
          <div className="overflow-x-auto rounded-2xl border-0 bg-surface-0 shadow-soft">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-brand-200/60 bg-brand-50/50">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-surface-400">Prop</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-surface-400">Type</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-surface-400">Default</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-surface-400">Description</th>
                </tr>
              </thead>
              <tbody>
                {entry.props.map((p, i) => (
                  <tr key={p.name} className={cn("border-b border-surface-100 last:border-b-0", i % 2 === 1 && "bg-surface-50/50")}>
                    <td className="px-4 py-2.5 align-top font-mono text-sm font-semibold text-brand-700">{p.name}</td>
                    <td className="px-4 py-2.5 align-top font-mono text-xs text-surface-500">{p.type}</td>
                    <td className="px-4 py-2.5 align-top font-mono text-xs text-surface-400">{p.default ?? "—"}</td>
                    <td className="px-4 py-2.5 align-top text-sm text-surface-600">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Demo */}
      <section id="sec-demo" className="mt-8 scroll-mt-24">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <SectionLabel>Live demo</SectionLabel>
          <DemoViewChips view={view} onChange={setView} showPlayground={playground !== null} />
        </div>
        {view === "ab" ? (
          <ThemeCompare demo={entry.demo} />
        ) : view === "wall" ? (
          <ThemeWall demo={entry.demo} />
        ) : view === "playground" && playground ? (
          <Playground def={playground} />
        ) : (
          <div className="rounded-2xl border-0 bg-surface-100 shadow-inset p-4 shadow-soft sm:p-6">{entry.demo}</div>
        )}
      </section>

      <CrossLinks entry={entry} onNavigate={onNavigate} />

      {/* Prev / Next */}
      <PrevNext prev={prev} next={next} onNavigate={onNavigate} />
    </article>
  );
}

/** Linear pagination between entries (components and dashboard templates). */
function PrevNext({
  prev,
  next,
  onNavigate,
}: {
  prev: ComponentEntry | DashboardEntry | null;
  next: ComponentEntry | DashboardEntry | null;
  onNavigate: (id: string) => void;
}) {
  return (
    <footer className="mt-10 flex items-center justify-between gap-3 border-t border-surface-200 pt-5">
      {prev ? (
        <button
          type="button"
          onClick={() => onNavigate(prev.id)}
          className="group flex max-w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-100"
        >
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-surface-400">
            <ArrowL /> Previous
          </span>
          <span className="truncate text-sm font-semibold text-surface-800 group-hover:text-brand-700">
            {prev.name}
          </span>
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button
          type="button"
          onClick={() => onNavigate(next.id)}
          className="group flex max-w-full flex-col items-end gap-0.5 rounded-lg px-3 py-2 text-right transition-colors hover:bg-surface-100"
        >
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-surface-400">
            Next <ArrowR />
          </span>
          <span className="truncate text-sm font-semibold text-surface-800 group-hover:text-brand-700">
            {next.name}
          </span>
        </button>
      ) : (
        <span />
      )}
    </footer>
  );
}

function OverviewHero({ componentTotal }: { componentTotal: number }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadKit();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface-0 p-8 shadow-raised sm:p-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-info-200/40 blur-3xl"
      />

      <div className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" size="sm" dot>
            Soft UI · {componentTotal + 1} components
          </Badge>
          <Badge variant="neutral" size="sm">7 kits · 10 packages</Badge>
        </div>

        <h1 className="mt-5 max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">
          The whole kit.
          <br />
          <span className="text-gradient-brand">One download.</span>
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-surface-500">
          {componentTotal + 1} components across 7 kits + {ALL_DASHBOARDS.length} dashboard templates live
          in this vault. 24 make up the free core (MIT) — install them with one line from npm, add any
          component with the CLI (npx vault-ui add &lt;component&gt;), or download the bundle: the real
          theme file, per-component usage snippets, and a runnable starter app.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            fullWidth
            className="sm:w-auto"
            onClick={handleDownload}
            disabled={downloading}
            leadingIcon={downloading ? <Package className="size-5 animate-pulse" /> : <Download className="size-5" />}
          >
            {downloading ? "Packing zip…" : "Download kit (.zip)"}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            className="sm:w-auto"
            onClick={copyInstall}
            leadingIcon={copied ? <Check className="size-5 text-success-500" /> : <Terminal className="size-5" />}
          >
            {copied ? "Copied!" : "Copy install command"}
          </Button>
        </div>

        <div className="mt-6">
          <InstallTabs packages={["@vaultui/tokens", "@vaultui/utils", "@vaultui/ui"]} compact />
        </div>

        <p className="mt-3 flex items-center gap-2 font-mono text-xs text-surface-400">
          <Terminal className="size-3.5" />
          Prefer the CLI? <code className="text-brand-700">npx vault-ui add &lt;component&gt;</code> —
          adds the exact component source to your project.
        </p>
          </div>

          {/* Right — the mark + slogan */}
          <div className="hidden flex-col items-center gap-5 lg:flex">
            <VaultLogo size={190} />
            <p className="max-w-[240px] text-center text-sm italic leading-relaxed text-surface-500">
              “The details are not the details. They make the design.”
            </p>
          </div>
        </div>

        {/* Getting started — the three-step kit flow */}
        <div className="mt-7 border-t border-surface-200/70 pt-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Getting started
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-surface-800">
            Your kit, in three steps
          </h3>
          <ol className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { n: "1", t: "Create a project", d: "Name it — that's the kit you're building.", icon: <FolderPlus className="size-4" /> },
              { n: "2", t: "Add components", d: "Hit “Add to project” on anything you like in the vault.", icon: <Plus className="size-4" /> },
              { n: "3", t: "Download your kit", d: "Your project page turns it into a themed zip + install command.", icon: <Download className="size-4" /> },
            ].map(({ n, t, d, icon }) => (
              <li key={n} className="rounded-2xl border border-surface-200/70 bg-surface-0 p-4 shadow-soft">
                <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {n}
                </span>
                <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-surface-800">
                  {icon}
                  {t}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-surface-500">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400">{children}</h2>;
}

/** Pin / unpin the current entry to the overview's shortlist. */
function FavoriteButton({ entryId }: { entryId: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(entryId);
  return (
    <Button
      size="sm"
      variant="ghost"
      aria-pressed={active}
      title={active ? "Unpin from overview" : "Pin to overview"}
      onClick={() => toggle(entryId)}
      leadingIcon={<Star className={cn("size-4", active && "fill-warning-400 text-warning-500")} />}
    >
      {active ? "Pinned" : "Pin"}
    </Button>
  );
}

/** "On this page" jump chips — find a section without scrolling the article. */
function SectionJump({ items }: { items: { id: string; label: string }[] }) {
  if (items.length === 0) return null;
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };
  return (
    <nav aria-label="On this page" className="mt-4 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-surface-400">On this page</span>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => jump(it.id)}
          className="rounded-full border border-surface-200 bg-surface-0 px-2.5 py-1 text-xs text-surface-600 shadow-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
          {it.label}
        </button>
      ))}
    </nav>
  );
}

/** Overview shortcuts: recently viewed + pinned entries (renders nothing when empty). */
function PersonalShortcuts({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { favorites } = useFavorites();
  const recents = readRecents();

  const resolve = (ids: string[]) =>
    ids
      .map((id) => entryById(id))
      .filter((e): e is ComponentEntry | DashboardEntry => e !== null);

  const recentEntries = resolve(recents);
  const pinnedEntries = resolve(favorites);

  if (recentEntries.length === 0 && pinnedEntries.length === 0) return null;

  return (
    <>
      {recentEntries.length > 0 && (
        <section className="mt-8">
          <SectionLabel>Continue where you left off</SectionLabel>
          <ShortcutRow entries={recentEntries} onNavigate={onNavigate} />
        </section>
      )}
      {pinnedEntries.length > 0 && (
        <section className="mt-8">
          <SectionLabel>Pinned</SectionLabel>
          <ShortcutRow entries={pinnedEntries} onNavigate={onNavigate} />
        </section>
      )}
    </>
  );
}

function ShortcutRow({
  entries,
  onNavigate,
}: {
  entries: (ComponentEntry | DashboardEntry)[];
  onNavigate: (id: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e) => (
        <button
          key={e.id}
          type="button"
          onClick={() => onNavigate(e.id)}
          className="group flex items-center justify-between gap-2 rounded-xl border border-surface-200 bg-surface-0 px-3 py-2.5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-surface-800 group-hover:text-brand-700">
              {e.name}
            </span>
            <span className="block truncate text-xs text-surface-400">
              {GROUP_NAME_BY_ID.get(e.id) ?? (e.kind === "dashboard" ? "Dashboard" : "")}
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-surface-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
        </button>
      ))}
    </div>
  );
}

/** Demo / Playground / Theme A/B switcher for an entry's preview. */
function DemoViewChips({
  view,
  onChange,
  showPlayground,
}: {
  view: DemoView;
  onChange: (v: DemoView) => void;
  showPlayground: boolean;
}) {
  const chips: Array<{ id: DemoView; label: string }> = [
    { id: "demo", label: "Demo" },
    ...(showPlayground ? [{ id: "playground" as const, label: "Playground" }] : []),
    { id: "ab", label: "Theme A/B" },
    { id: "wall", label: "Theme wall" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-lg border border-surface-200 bg-surface-0 p-1 shadow-inset">
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          aria-pressed={view === c.id}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            view === c.id
              ? "bg-brand-600 text-white shadow-soft"
              : "text-surface-500 hover:bg-surface-100 hover:text-surface-800",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

/** Install tabs are rendered in the Usage section (InstallTabs per manager). */

/**
 * Per-entry cart control: add to the active project, or view/remove it once
 * added. With no projects yet it points at project creation instead.
 */
function AddToProjectControl({ entryId, className }: { entryId: string; className?: string }) {
  const { activeProject, projects, toggleItem, isInActiveProject } = useProjects();
  const navigate = useNavigate();

  let content: React.ReactNode;
  if (projects.length === 0) {
    content = (
      <Button size="sm" variant="ghost" onClick={() => navigate("/projects")} leadingIcon={<FolderPlus className="size-4" />}>
        New project
      </Button>
    );
  } else if (!activeProject) {
    content = (
      <Button size="sm" variant="ghost" onClick={() => navigate("/projects")} leadingIcon={<FolderPlus className="size-4" />}>
        Select a project
      </Button>
    );
  } else if (isInActiveProject(entryId)) {
    content = (
      <>
        <span className="flex items-center gap-2">
          <Badge variant="success" size="sm" dot>
            In {activeProject.name}
          </Badge>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/projects/${activeProject.id}`)}>
            View project
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Remove ${entryId} from ${activeProject.name}`}
            onClick={() => toggleItem(entryId)}
          >
            <X className="size-4" />
          </Button>
        </span>
      </>
    );
  } else {
    content = (
      <Button size="sm" onClick={() => toggleItem(entryId)} leadingIcon={<Plus className="size-4" />}>
        Add to project
      </Button>
    );
  }

  return (
    <div id="onboard-add" className={cn("flex flex-wrap items-center gap-2", className)}>
      {content}
    </div>
  );
}

/**
 * React grab — type a comment, copy the component's React snippet with the
 * comment prepended (each line becomes a `// comment`).
 */
function ReactGrab({ entry }: { entry: ComponentEntry }) {
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);

  const entered = comment.trim();
  const commentBlock = (entered ? entered.split("\n") : ["your comment"])
    .map((line) => `// ${line}`)
    .join("\n");
  const importLine = `import ${entry.importName} from "${entry.package}";`;
  const snippet = `${commentBlock}\n${importLine}\n\n${entry.usage}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-800 bg-surface-950 shadow-soft">
      <div className="flex items-center justify-between gap-2 border-b border-surface-800 bg-surface-900 px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-surface-400">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
          <Grab className="size-4" strokeWidth={2} />
          {entry.name} · react grab
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy snippet to clipboard"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
            copied
              ? "bg-success-500/20 text-success-400"
              : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" strokeWidth={2.5} /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" strokeWidth={2.5} /> Copy
            </>
          )}
        </button>
      </div>

      {/* Comment line — editable, becomes the top of the snippet */}
      <div className="border-b border-surface-800">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={entered ? Math.min(entered.split("\n").length, 4) + 1 : 1}
          placeholder="// your comment — it lands on top of the snippet"
          spellCheck={false}
          className="w-full resize-none bg-transparent px-4 py-2.5 font-mono text-sm leading-relaxed text-surface-200 placeholder:text-surface-600 focus:outline-none"
        />
      </div>

      {/* Live preview with the comment attached */}
      <pre className="max-h-80 overflow-auto p-4 font-mono text-sm leading-relaxed text-surface-200">
        <code>
          {commentBlock.split("\n").map((line, i) => (
            <span key={i} className="block italic text-surface-500">
              {line}
            </span>
          ))}
          <span className="block text-brand-300">{importLine}</span>
          <span className="block">&nbsp;</span>
          {entry.usage}
        </code>
      </pre>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-800 bg-surface-950 shadow-soft">
      <div className="flex items-center justify-between gap-2 border-b border-surface-800 bg-surface-900 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-surface-400">{title}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          className={cn(
            "inline-flex items-center rounded-md p-1.5 transition-colors",
            copied ? "bg-success-500/20 text-success-400" : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
          )}
        >
          {copied ? <Check className="size-4" strokeWidth={2.5} /> : <Copy className="size-4" strokeWidth={2.5} />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-surface-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ArrowL() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowR() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
  );
}
/* ======================= overview enhancement sections ======================= */

const KIT_ACCENTS: Record<string, string> = {
  "Free tier": "bg-success-500/15 text-success-500",
  "AI Agent Kit": "bg-brand-100 text-brand-700",
  "Data Viz Pro": "bg-info-500/15 text-info-500",
  "Commerce Kit": "bg-warning-500/15 text-warning-500",
  "Dev Tools Kit": "bg-surface-200 text-surface-700",
  "Project Kit": "bg-success-500/15 text-success-500",
  "Collab Kit": "bg-danger-500/15 text-danger-500",
  "Marketing Kit": "bg-brand-100 text-brand-700",
};

/** Cross-links: what uses this entry, and its siblings in the same kit. */
function CrossLinks({
  entry,
  onNavigate,
}: {
  entry: ComponentEntry | DashboardEntry;
  onNavigate: (id: string) => void;
}) {
  const group = ALL_GROUPS.find((g) => g.items.some((i) => i.id === entry.id)) ?? null;
  const related = group
    ? group.items.filter((i) => i.id !== entry.id && i.id !== "overview").slice(0, 6)
    : [];
  const usedIn =
    entry.kind !== "dashboard"
      ? ALL_DASHBOARDS.filter((d) => d.packages.includes(entry.package))
      : [];
  const composed =
    entry.kind === "dashboard"
      ? ALL_COMPONENTS.filter((c) => c.id !== "overview" && entry.packages.includes(c.package)).slice(0, 12)
      : [];

  if (related.length === 0 && usedIn.length === 0 && composed.length === 0) return null;

  return (
    <section className="mt-8 space-y-6">
      {usedIn.length > 0 && (
        <div>
          <SectionLabel>Used in these dashboards</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {usedIn.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onNavigate(d.id)}
                className="rounded-full border border-surface-200 bg-surface-0 px-3 py-1.5 text-xs font-medium text-surface-600 shadow-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && group && (
        <div>
          <SectionLabel>More in {group.group}</SectionLabel>
          <ShortcutRow entries={related} onNavigate={onNavigate} />
        </div>
      )}

      {composed.length > 0 && (
        <div>
          <SectionLabel>Composed from</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {composed.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onNavigate(c.id)}
                className="rounded-full border border-surface-200 bg-surface-0 px-3 py-1.5 text-xs font-medium text-surface-600 shadow-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function OverviewStats({ total }: { total: number }) {
  const kits = ALL_GROUPS.filter((g) => g.group !== "Start" && g.group !== "Free tier").length;
  const items = [
    { k: total, v: "components" },
    { k: 24, v: "free · MIT" },
    { k: kits, v: "premium kits" },
    { k: ALL_DASHBOARDS.length, v: "dashboard templates" },
    { k: 10, v: "packages" },
    { k: 4, v: "live themes" },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-surface-200/70 shadow-soft sm:grid-cols-3 lg:grid-cols-6">
      {items.map((s) => (
        <div key={s.v} className="group bg-surface-0 px-3 py-4 text-center transition-colors hover:bg-brand-50/40">
          <dd className="text-2xl font-bold tracking-tight text-gradient-brand">{s.k}</dd>
          <dt className="mt-0.5 text-xs text-surface-500">{s.v}</dt>
        </div>
      ))}
    </div>
  );
}

function KitGrid({ onNavigate }: { onNavigate: (id: string) => void }) {
  const groups = ALL_GROUPS.filter((g) => g.group !== "Start");
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((g) => {
        const items = g.items.filter((i) => i.id !== "overview");
        const first = items[0];
        const free = g.group === "Free tier";
        return (
          <button
            key={g.group}
            type="button"
            onClick={() => first && onNavigate(first.id)}
            className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-raised"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", KIT_ACCENTS[g.group] ?? "bg-surface-100 text-surface-600")}>
                {g.group}
              </span>
              <Badge variant={free ? "success" : "brand"} size="sm">
                {items.length} {free ? "free" : ""}
              </Badge>
            </div>
            <p className="mt-2 truncate text-sm text-surface-500">
              {items.slice(0, 3).map((i) => i.name).join(" · ")}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
              Browse <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DashStrip({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
      <div className="flex flex-wrap gap-2">
        {ALL_DASHBOARDS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onNavigate(d.id)}
            className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1.5 font-mono text-xs text-surface-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            {d.name}
          </button>
        ))}
      </div>
      <p className="max-w-xs text-xs leading-relaxed text-surface-400">
        Full-page products composed from Vault components — re-skinned by all 4 themes, previewed with Theme A/B.
      </p>
    </div>
  );
}

function FeatureLinks({ navigate }: { navigate: (to: string) => void }) {
  const tools = [
    { emoji: "🎨", title: "Rebrand lab", body: "Drag the hue, radius and elevation — export your token override.", to: "/lab" },
    { emoji: "🖌️", title: "Design composer", body: "Pick primitives, preview a screen, copy a runnable App.tsx.", to: "/composer" },
    { emoji: "🔍", title: "⌘K palette", body: "Jump to any component from anywhere in the docs.", to: "", action: "press ⌘K" },
    { emoji: "🧩", title: "vault-ui CLI", body: "npx vault-ui add <component> — source straight into your project.", to: "", action: "copy command" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((t) => (
        <button
          key={t.title}
          type="button"
          onClick={() => t.to && navigate(t.to)}
          className="group flex flex-col items-start gap-2 rounded-2xl border border-surface-200 bg-surface-0 p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300"
        >
          <span className="text-xl">{t.emoji}</span>
          <span className="text-sm font-semibold text-surface-800">{t.title}</span>
          <span className="text-xs leading-relaxed text-surface-500">{t.body}</span>
          <span className="mt-1 font-mono text-xs font-medium text-brand-600">{t.action ?? "open →"}</span>
        </button>
      ))}
    </div>
  );
}

function GuidelinesStrip({ onNavigate }: { onNavigate: (id: string) => void }) {
  const topics = [
    { id: "typography", label: "Typography", desc: "type scale · line-height · line length" },
    { id: "spacing", label: "Spacing", desc: "proximity · grouping · constrained widths" },
    { id: "color", label: "Color", desc: "tinted neutrals · 50–950 scales · contrast" },
    { id: "component-states", label: "States", desc: "hover · focus · disabled · loading" },
    { id: "do-dont", label: "DO / DON'T", desc: "the anti-pattern wall of shame" },
    { id: "checklist", label: "Quality checker", desc: "48-point pre-ship checklist" },
  ];
  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-surface-800">The do/don't playbook</p>
          <p className="mt-0.5 text-xs leading-relaxed text-surface-500">
            Rule → Why → Do / Don't → Agent Check, plus ✕/✓ visual comparisons — the same
            style guide this product was built against, live in the vault.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onNavigate(t.id)}
            className="group flex items-center justify-between gap-2 rounded-xl border border-surface-200 bg-surface-50/60 px-3 py-2.5 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40"
          >
            <span>
              <span className="block text-sm font-semibold text-surface-800 group-hover:text-brand-700">{t.label}</span>
              <span className="block text-xs leading-relaxed text-surface-400">{t.desc}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-surface-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
          </button>
        ))}
      </div>
    </div>
  );
}

function StartCard({ hasProjects, navigate }: { hasProjects: boolean; navigate: (to: string) => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-surface-0 p-6 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Start building</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Your kit is three taps away</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-surface-500">
            Create a project, add components from the vault, then download your curated kit — or share it as a public link.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" onClick={() => navigate("/projects")} leadingIcon={<Plus className="size-5" />}>
            {hasProjects ? "Open my projects" : "Create a project"}
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate("/docs/components/button")} trailingIcon={<ArrowRight className="size-5" />}>
            Browse components
          </Button>
        </div>
      </div>
    </div>
  );
}
