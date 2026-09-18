import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Card, Input, Progress, Slider, Switch } from "@vaultui/ui";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { DocsHeader } from "../layout/DocsHeader";
import { InstallTabs } from "../components/InstallTabs";
import { ALL_COMPONENTS, ALL_DASHBOARDS } from "../projects/entries";

/**
 * Design Composer — pick components, preview them on one canvas, export a
 * ready-to-run App.tsx (or copy the install command). A compose-then-export
 * surface that pairs with the kit builder.
 */

interface Composable {
  id: string;
  name: string;
  pkg: string;
  importName: string;
  snippet: string;
  demo: React.ReactNode;
}

const LIBRARY: Composable[] = [
  {
    id: "button", name: "Button", pkg: "@vaultui/ui", importName: "{ Button }",
    snippet: "<Button size=\"lg\" leadingIcon={<Arrow />}>Get started</Button>",
    demo: <Button size="lg" leadingIcon={<ArrowIcon />}>Get started</Button>,
  },
  {
    id: "badge", name: "Badge", pkg: "@vaultui/ui", importName: "{ Badge }",
    snippet: "<Badge variant=\"success\" dot>Live</Badge>",
    demo: <Badge variant="success" dot>Live</Badge>,
  },
  {
    id: "card", name: "Card", pkg: "@vaultui/ui", importName: "{ Card }",
    snippet: "<Card padding=\"lg\" hover>Content</Card>",
    demo: (
      <Card padding="lg">
        <p className="text-sm font-semibold">Onboarding complete</p>
        <p className="mt-1 text-sm text-surface-500">Your team is set up and ready to ship.</p>
      </Card>
    ),
  },
  {
    id: "switch", name: "Switch", pkg: "@vaultui/ui", importName: "{ Switch }",
    snippet: "<Switch defaultChecked />",
    demo: (
      <div className="flex items-center gap-2">
        <Switch defaultChecked />
        <span className="text-sm">Auto-alerts</span>
      </div>
    ),
  },
  {
    id: "input", name: "Input", pkg: "@vaultui/ui", importName: "{ Input }",
    snippet: "<Input placeholder=\"you@company.com\" />",
    demo: <Input placeholder="you@company.com" className="max-w-xs" />,
  },
  {
    id: "progress", name: "Progress", pkg: "@vaultui/ui", importName: "{ Progress }",
    snippet: "<Progress value={72} />",
    demo: (
      <div className="w-full max-w-xs">
        <Progress value={72} />
      </div>
    ),
  },
  {
    id: "slider", name: "Slider", pkg: "@vaultui/ui", importName: "{ Slider }",
    snippet: "<Slider value={64} onChange={setV} />",
    demo: <Slider value={64} onChange={() => undefined} className="max-w-xs" />,
  },
  {
    id: "avatar", name: "Avatar", pkg: "@vaultui/ui", importName: "{ Avatar }",
    snippet: "<Avatar name=\"Sagar Babu\" size=\"lg\" />",
    demo: <Avatar name="Sagar Babu" size="lg" />,
  },
];

function buildApp(picked: Composable[]): string {
  const pkgs = [...new Set(picked.map((p) => p.pkg))];
  const imports = pkgs.map((p) => {
    const names = picked.filter((x) => x.pkg === p).map((x) => x.importName).join(", ");
    return `import ${names} from "${p}";`;
  });
  const lines = picked.map((p) => `        ${p.snippet}`);
  return [
    `import { useState } from "react";`,
    ...imports,
    "",
    "export function App() {",
    "  return (",
    "    <div className=\"mx-auto flex max-w-3xl flex-col items-start gap-4 p-8\">",
    ...lines,
    "    </div>",
    "  );",
    "}",
    "",
  ].join("\n");
}

export function ComposerPage() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>(["button", "card", "badge"]);
  const [copied, setCopied] = useState(false);

  const selected = LIBRARY.filter((l) => picked.includes(l.id));
  const code = buildApp(selected);
  const installPackages = [...new Set(selected.map((s) => s.pkg))];

  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

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
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <DocsHeader
        componentTotal={ALL_COMPONENTS.length - 1}
        dashboardTotal={ALL_DASHBOARDS.length}
        onOpenDrawer={() => undefined}
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
              {/* Back to the vault */}
      <button
        type="button"
        onClick={() => navigate("/docs")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </button>

<div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">Design canvas</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Compose a <span className="text-gradient-brand">screen</span>, export the app.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-500">
              Pick primitives, preview them together on the canvas, then copy a runnable App.tsx — or the install command for exactly what you used.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <InstallTabs packages={installPackages} compact />
            <Button size="sm" onClick={copy} leadingIcon={copied ? <Check className="size-4 text-success-500" /> : <Copy className="size-4" />}>
              {copied ? "Copied!" : "Copy App.tsx"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Library */}
          <div className="lg:col-span-2">
            <Card padding="lg" className="space-y-2.5">
              <p className="text-sm font-semibold text-surface-800">Library — free core</p>
              {LIBRARY.map((l) => {
                const active = picked.includes(l.id);
                return (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(l.id)}
                    className={
                      "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors " +
                      (active
                        ? "border-brand-300 bg-brand-50"
                        : "border-surface-200 bg-surface-0 hover:bg-surface-100")
                    }
                  >
                    <span className="text-sm font-medium text-surface-700">{l.name}</span>
                    <span className={"font-mono text-[10px] " + (active ? "text-brand-600" : "text-surface-400")}>
                      {active ? "on canvas" : "add"}
                    </span>
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Canvas + code */}
          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-2xl border border-surface-200 bg-surface-100 p-5 shadow-inset">
              {selected.length === 0 ? (
                <p className="py-10 text-center text-sm text-surface-400">Add components from the library — they'll stack here.</p>
              ) : (
                <div className="space-y-4 rounded-xl bg-surface-50 p-5 shadow-soft">
                  {selected.map((l) => (
                    <div key={l.id}>{l.demo}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-800 bg-surface-950 shadow-soft">
              <div className="flex items-center justify-between border-b border-surface-800 bg-surface-900 px-3 py-2">
                <span className="font-mono text-[11px] text-surface-400">App.tsx · {selected.length} components</span>
                <button
                  type="button"
                  onClick={copy}
                  className={
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors " +
                    (copied ? "bg-success-500/20 text-success-400" : "text-surface-400 hover:bg-surface-800 hover:text-surface-200")
                  }
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="max-h-72 overflow-auto p-4 font-mono text-[12.5px] leading-relaxed text-surface-200">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}