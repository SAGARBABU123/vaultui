import { Badge, Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { Check, Copy, Download, FolderPlus, Grab, Package, Plus, Terminal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { INSTALL_COMMAND, downloadKit } from "./downloadKit";
import { Playground, PLAYGROUNDS, type PlaygroundBuilder } from "./Playground";
import { ThemeCompare } from "./ThemeCompare";
import { ThemeWall } from "./ThemeWall";
import { ComponentInsights } from "./ComponentInsights";
import { useProjects } from "../projects/ProjectContext";
import type { ComponentEntry, DashboardEntry } from "./types";

type DemoView = "demo" | "playground" | "ab" | "wall";

export interface ComponentShellProps {
  entry: ComponentEntry | DashboardEntry;
  prev: ComponentEntry | DashboardEntry | null;
  next: ComponentEntry | DashboardEntry | null;
  onNavigate: (id: string) => void;
  /** Number of component entries (overview excluded) — used for the overview copy. */
  componentTotal: number;
}

export function ComponentShell({ entry, prev, next, onNavigate, componentTotal }: ComponentShellProps) {
  const [view, setView] = useState<DemoView>("demo");
  useEffect(() => setView("demo"), [entry.id]);

  const playground: PlaygroundBuilder | null = entry.kind === "dashboard" ? null : (PLAYGROUNDS[entry.id] ?? null);
  if (entry.id === "overview") {
    return (
      <article key={entry.id} className="animate-rise">
        <OverviewHero componentTotal={componentTotal} />
        <section className="mt-8">
          <SectionLabel>What's inside</SectionLabel>
          <div className="rounded-2xl border-0 bg-surface-50 p-4 shadow-soft sm:p-6">{entry.demo}</div>
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
            <AddToProjectControl entryId={entry.id} className="ml-auto" />
          </div>
          <p className="mt-2 max-w-2xl leading-relaxed text-surface-500">{entry.description}</p>
          {entry.packages.length > 0 && (
            <code className="mt-3 inline-block rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-1 font-mono text-xs text-surface-600">
              {entry.packages.join(" · ")}
            </code>
          )}
        </header>

        {/* Live preview — full-bleed composition, re-skins with the theme dropdown */}
        <section className="mt-6">
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
          {entry.id !== "overview" && <AddToProjectControl entryId={entry.id} className="ml-auto" />}
        </div>
        <p className="mt-2 max-w-2xl leading-relaxed text-surface-500">{entry.description}</p>
        {entry.id !== "overview" && <ComponentInsights entry={entry} />}
      </header>

      {entry.id !== "overview" && (
        <>
          {/* React grab — select + comment + copy (first thing you see) */}
          <section className="mt-6">
            <SectionLabel>React grab</SectionLabel>
            <p className="mb-3 text-sm leading-relaxed text-surface-500">
              Grab this component — type a comment and it gets dropped into the copied snippet.
            </p>
            <ReactGrab entry={entry} />
          </section>

          {/* Usage */}
          <section className="mt-8">
            <SectionLabel>Usage</SectionLabel>
            <div className="grid gap-4 lg:grid-cols-2">
              <CodeBlock title="Install" code={installSnippet(entry)} />
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
        <section className="mt-8">
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
                    <td className="px-4 py-2.5 align-top font-mono text-[13px] font-semibold text-brand-700">{p.name}</td>
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
      <section className="mt-8">
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
          <span className="flex items-center gap-1 text-xs text-surface-400">
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
          <span className="flex items-center gap-1 text-xs text-surface-400">
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
          104 components across 7 kits + 5 dashboard templates live in this vault. 24 make up the
          free core (MIT) — install them with one line from npm, add any component with the CLI
          (npx vault-ui add &lt;component&gt;), or download the bundle: the real theme file,
          per-component usage snippets, and a runnable starter app.
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

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Copy className="size-3.5 text-surface-400" />
          <code className="rounded-lg bg-surface-100 px-2.5 py-1 font-mono text-xs text-surface-600 shadow-inset">
            {INSTALL_COMMAND}
          </code>
        </div>

        <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-surface-400">
          <Terminal className="size-3.5" />
          Prefer the CLI? <code className="text-brand-700">npx vault-ui add &lt;component&gt;</code> —
          adds the exact component source to your project.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400">{children}</h2>;
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
    ...(showPlayground ? [{ id: "playground" as const, label: "⚙ Playground" }] : []),
    { id: "ab", label: "⧉ Theme A/B" },
    { id: "wall", label: "▦ Theme wall" },
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

/** Install snippet — CLI first (adds the exact component), npm as fallback. */
function installSnippet(entry: ComponentEntry): string {
  return `# quick start — add the component with the CLI\nnpx vault-ui add ${entry.id}\n\n# or install from npm\npnpm add ${entry.package}`;
}

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
          className="w-full resize-none bg-transparent px-4 py-2.5 font-mono text-[13px] leading-relaxed text-surface-200 placeholder:text-surface-600 focus:outline-none"
        />
      </div>

      {/* Live preview with the comment attached */}
      <pre className="max-h-80 overflow-auto p-4 font-mono text-[13px] leading-relaxed text-surface-200">
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
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-surface-200">
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