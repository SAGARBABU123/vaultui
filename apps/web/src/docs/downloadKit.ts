import JSZip from "jszip";
import { COMPONENT_GROUPS } from "./registry";
import { EXTRA_GROUPS } from "./registry-extra";
import { entryById } from "../projects/entries";
import { INSTALL_COMMAND } from "../projects/counts";
import type { ComponentEntry, DashboardEntry } from "./types";

/** The live theme source, exported raw so the zip ships the real tokens. */
import tokensCss from "@vaultui/tokens/tokens.css?raw";

const KIT_PACKAGES = ["@vaultui/tokens", "@vaultui/utils", "@vaultui/ui"];

const TIERS: Record<string, string> = {
  free: "Free · MIT",
  paid: "Paid kit · commercial license",
};

/** All entries, merged groups first (overview first). */
export function allEntries(): ComponentEntry[] {
  const groups = [...COMPONENT_GROUPS, ...EXTRA_GROUPS];
  const map = new Map<string, ComponentEntry[]>();
  for (const g of groups) {
    const list = map.get(g.group) ?? [];
    list.push(...g.items);
    map.set(g.group, list);
  }
  return [...map.values()].flat();
}

/** Per-package install lines for a selection — the "make a command for those
 * components separately" output. Free core first, then each kit actually used.
 */
export function buildInstallCommand(entries: ComponentEntry[]): string {
  const packages = new Set<string>();
  for (const e of entries) {
    if (e.id === "overview" || e.package === "—") continue;
    packages.add(e.package);
  }
  const core = packages.has("@vaultui/ui") || packages.size === 0;
  const lines: string[] = core ? [INSTALL_COMMAND] : [`pnpm add ${KIT_PACKAGES[0]} ${KIT_PACKAGES[1]}`];
  for (const pkg of packages) {
    if (KIT_PACKAGES.includes(pkg)) continue;
    lines.push(`pnpm add ${pkg}  # commercial kit — ships with the purchase license`);
  }
  const theme = "@import \"@vaultui/tokens/tokens.css\";";
  return [...lines, "", "/* in your CSS entry:", `   ${theme} */`].join("\n");
}

function buildReadme(entries: ComponentEntry[], projectName?: string, dashboards?: DashboardEntry[]): string {
  const title = projectName ? `${projectName} — Vault UI Kit Bundle` : "Vault UI — Kit Bundle";
  const lines: string[] = [
    `# ${title}`,
    "",
    projectName
      ? "A curated selection from Vault UI — your project, your components."
      : "The complete theme + component package.",
    "",
    "## 1 · Theme",
    "",
    "The full soft-UI theme lives in `tokens/theme.css` (design tokens for",
    "Tailwind v4: palette, radii, neumorphic shadows, motion, Inter Variable).",
    "",
    "For npm consumers: `pnpm add @vaultui/tokens` then import in your CSS entry:",
    "",
    "```css",
    "@import \"@vaultui/tokens/tokens.css\";",
    "```",
    "",
    "## 2 · Install",
    "",
    "```bash",
    buildInstallCommand(entries),
    "```",
    "",
    "Note: `@vaultui/tokens`, `@vaultui/utils`, `@vaultui/ui` are MIT; the kits are",
    "paid components (see COMMERCIAL-LICENSE.md in the repo).",
    "",
    "## 3 · Components",
    "",
  ];

  const groups = new Map<string, ComponentEntry[]>();
  for (const e of entries) {
    const list = groups.get(e.package) ?? [];
    list.push(e);
    groups.set(e.package, list);
  }

  for (const [pkg, list] of groups) {
    lines.push(`### ${pkg} (${TIERS[list[0]!.tier] ?? "paid"})`, "");
    for (const e of list) {
      if (e.id === "overview") continue;
      lines.push(`#### ${e.name}`, "");
      lines.push(e.description, "");
      lines.push("```tsx", `import ${e.importName} from "${e.package}";`, "", e.usage, "```", "");
    }
  }

  lines.push(
    "## 4 · Starter app",
    "",
    "`starter/` is a minimal Vite + React + Tailwind v4 app pre-wired to the theme.",
    "```bash",
    "cd starter && pnpm install && pnpm dev",
    "```",
    "",
    "Happy building! 💎",
  );

  // Dashboard templates make the README, but cannot ship as copyable code.
  if (dashboards && dashboards.length > 0) {
    lines.splice(
      lines.length - 2,
      0,
      "",
      "## 5 · Dashboard templates",
      "",
      "Included templates (preview them live in the vault, re-skinned by any theme):",
      "",
      ...dashboards.map((d) => `- **${d.name}** — ${d.description} (${d.packages.join(", ")})`),
      "",
    );
  }
  return lines.join("\n");
}

function buildStarterApp(entries: ComponentEntry[]): string {
  const ai = entries.find((e) => e.id === "chat-canvas");
  const kpi = entries.find((e) => e.id === "kpi-card");
  const code = [
    "import { Badge, Button, Card } from \"@vaultui/ui\";",
    ai ? `import { ChatCanvas } from "@vaultui/ai-chat";` : "",
    kpi ? `import { KpiCard } from "@vaultui/data-viz";` : "",
    "",
    `export function App() {`,
    `  return (`,
    `    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">`,
    `      <Badge variant="brand" dot>Soft UI theme · ${entries.length} components</Badge>`,
    `      <h1 className="text-3xl font-bold">Vault UI is live</h1>`,
    `      <div className="flex gap-3">`,
    `        <Button>Primary</Button>`,
    `        <Button variant="secondary">Secondary</Button>`,
    `      </div>`,
    `      <div className="grid w-full max-w-2xl grid-cols-2 gap-4">`,
    kpi ? `        <KpiCard label="Downloads" value={482} delta={12.4} trend={[40, 60, 55, 80, 90]} hint="this week" />` : "",
    `      </div>`,
    ai
      ? `      {/* ChatCanvas, PricingTable, KanbanBoard & friends slot in here */}`
      : ``,
    `    </div>`,
    `  );`,
    `}`,
  ].filter((l) => l !== "");
  return code.join("\n");
}

/** Normalize a download filename (project names go into the zip). */
function safeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "") || "vault-ui";
}

/**
 * Build the distributable kit bundle as a ZIP.
 *
 * With no entries → the complete kit (back-compat with the old downloadKit()).
 * With a selection → only those components (plus theme + starter + README),
 * plus any dashboard templates listed alongside.
 */
export async function buildProjectKitZip(options?: {
  entries?: ComponentEntry[];
  dashboards?: DashboardEntry[];
  projectName?: string;
}): Promise<Blob> {
  // Explicit selection (even empty) → ship exactly that. No options → whole kit.
  const entries = options ? options.entries! : allEntries();
  const dashboards = options?.dashboards ?? [];
  const name = options?.projectName?.trim() ? safeName(options.projectName) : "vault-ui";
  const zip = new JSZip();

  zip.file("tokens/theme.css", tokensCss);
  zip.file("README.md", buildReadme(entries, options?.projectName?.trim() || undefined, dashboards));

  // Starter app (Vite + React + Tailwind v4, pre-wired to the theme)
  const starter = zip.folder("starter")!;
  starter.file(
    "package.json",
    JSON.stringify(
      {
        name: `${name}-starter`,
        private: true,
        type: "module",
        scripts: { dev: "vite", build: "tsc --noEmit && vite build" },
        dependencies: {
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          "@vaultui/tokens": "latest",
          "@vaultui/utils": "latest",
          "@vaultui/ui": "latest",
        },
        devDependencies: {
          "@tailwindcss/vite": "^4.0.0",
          "@types/react": "^18.3.0",
          "@types/react-dom": "^18.3.0",
          "@vitejs/plugin-react": "^4.3.0",
          "tailwindcss": "^4.0.0",
          "typescript": "^5.7.0",
          "vite": "^5.4.10",
        },
      },
      null,
      2,
    ),
  );
  starter.file("index.html", '<div id="root"></div>\n<script type="module" src="/src/main.tsx"></script>');
  starter.file("vite.config.ts", 'import react from "@vitejs/plugin-react";\nimport tailwindcss from "@tailwindcss/vite";\nimport { defineConfig } from "vite";\n\nexport default defineConfig({ plugins: [react(), tailwindcss()] });');
  starter.file("src/main.tsx", 'import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "@vaultui/tokens/tokens.css";\nimport { App } from "./App";\n\ncreateRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);');
  starter.file("src/App.tsx", buildStarterApp(entries));

  return zip.generateAsync({ type: "blob" });
}

/** Trigger a browser download of the kit bundle (whole kit — back-compat). */
export async function downloadKit(): Promise<void> {
  const blob = await buildProjectKitZip();
  triggerBlobDownload(blob, "vault-ui-kit.zip");
}

/** Trigger a browser download of a project's selection. */
export async function downloadProjectSelection(
  componentIds: string[],
  dashboardIds: string[],
  projectName: string,
): Promise<void> {
  const entries = componentIds
    .map((id) => entryById(id))
    .filter((e): e is ComponentEntry => e !== null && e.kind !== "dashboard");
  const dashboards = dashboardIds
    .map((id) => entryById(id))
    .filter((e): e is DashboardEntry => e !== null && e.kind === "dashboard");
  const blob = await buildProjectKitZip({ entries, dashboards, projectName });
  triggerBlobDownload(blob, `${safeName(projectName)}-vault-ui.zip`);
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}