import { Badge, Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { Check, Copy, Download, Grab, Package, Terminal } from "lucide-react";
import { useState } from "react";
import { INSTALL_COMMAND, downloadKit } from "./downloadKit";
import type { ComponentEntry } from "./types";

export interface ComponentShellProps {
  entry: ComponentEntry;
  prev: ComponentEntry | null;
  next: ComponentEntry | null;
  onNavigate: (id: string) => void;
}

export function ComponentShell({ entry, prev, next, onNavigate }: ComponentShellProps) {
  if (entry.id === "overview") {
    return (
      <article key={entry.id} className="animate-rise">
        <OverviewHero />
        <section className="mt-8">
          <SectionLabel>What's inside</SectionLabel>
          <div className="rounded-2xl border-0 bg-surface-50 p-4 shadow-soft sm:p-6">{entry.demo}</div>
        </section>
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
        </div>
        <p className="mt-2 max-w-2xl leading-relaxed text-surface-500">{entry.description}</p>
        {entry.id !== "overview" && (
          <code className="mt-3 inline-block rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-1 font-mono text-xs text-surface-600">
            {entry.package}
          </code>
        )}
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
              <CodeBlock title="Install" code={`pnpm add ${entry.package}`} />
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
                <tr className="border-b border-surface-200 bg-surface-50">
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
        <div className="mb-3 flex items-center gap-2">
          <SectionLabel>Live demo</SectionLabel>
          <Badge variant={entry.tier === "free" ? "success" : "neutral"} size="sm" dot>
            interactive
          </Badge>
        </div>
        <div className="rounded-2xl border-0 bg-surface-100 shadow-inset p-4 shadow-soft sm:p-6">{entry.demo}</div>
      </section>

      {/* Prev / Next */}
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
    </article>
  );
}

function OverviewHero() {
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
            Soft UI · 48 components
          </Badge>
          <Badge variant="neutral" size="sm">6 kits · 8 packages</Badge>
        </div>

        <h1 className="mt-5 max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">
          The whole kit.
          <br />
          <span className="text-brand-600">One download.</span>
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-surface-500">
          The free core — design tokens, theme and {47} components — installs with one
          line from npm. Premium kits come with a license. Download the bundle for
          the real theme file, per-component usage snippets, and a runnable starter app.
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
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400">{children}</h2>;
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