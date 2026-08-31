/**
 * Builds registry.json — the machine-readable component registry consumed by
 * `vault-ui` (packages/cli) and the docs site.
 *
 * Free/core components embed their real source (module + css); paid kits are
 * distributed via npm packages, so their entries point at the package instead.
 *
 * Usage:  node scripts/registry-build.mjs
 * Output: registry.json (repo root) + apps/web/public/registry.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

/* ------------------------- free/core file mapping ------------------------ */

const CORE_FILES = {
  button: ["packages/ui/src/Button.tsx", "packages/ui/src/button.css"],
  badge: ["packages/ui/src/Badge.tsx"],
  card: ["packages/ui/src/Card.tsx"],
  switch: ["packages/ui/src/Switch.tsx", "packages/ui/src/primitives.css"],
  input: ["packages/ui/src/Inputs.tsx", "packages/ui/src/primitives.css"],
  "radio-group": ["packages/ui/src/CheckboxRadio.tsx", "packages/ui/src/primitives.css"],
  tabs: ["packages/ui/src/Tabs.tsx", "packages/ui/src/primitives.css"],
  accordion: ["packages/ui/src/Accordion.tsx", "packages/ui/src/primitives.css"],
  modal: ["packages/ui/src/Modal.tsx", "packages/ui/src/primitives.css"],
  avatar: ["packages/ui/src/Avatar.tsx", "packages/ui/src/primitives.css"],
  skeleton: ["packages/ui/src/Feedback.tsx", "packages/ui/src/primitives.css"],
  "empty-state": ["packages/ui/src/Feedback.tsx", "packages/ui/src/primitives.css"],
  breadcrumb: ["packages/ui/src/Breadcrumb.tsx", "packages/ui/src/primitives.css"],
  toast: ["packages/ui/src/Toast.tsx", "packages/ui/src/primitives.css"],
};

const CORE_META = {
  switch: { name: "Switch", usage: "<Switch checked={on} onCheckedChange={setOn} />", importName: "{ Switch }", description: "Token-driven toggle with sm/md sizes." },
  input: { name: "Input + Field", usage: "<Field label=\"Email\"><Input placeholder=\"you@company.com\" /></Field>", importName: "{ Input, Textarea, Select, Field }", description: "Input, textarea, select + label/hint/error Field." },
  "radio-group": { name: "Checkbox + RadioGroup", usage: "<Checkbox>Label</Checkbox> <RadioGroup options={…} />", importName: "{ Checkbox, RadioGroup }", description: "Custom checkbox and radio group." },
  tabs: { name: "Tabs", usage: "<Tabs defaultValue=\"a\" tabs={[{ id: \"a\", label, content }]} />", importName: "{ Tabs }", description: "Pill tabs with panel." },
  accordion: { name: "Accordion", usage: "<Accordion items={[{ title, content }]} />", importName: "{ Accordion }", description: "Single/multi-open accordion." },
  modal: { name: "Modal", usage: "<Modal open onClose title=\"Confirm\">…</Modal>", importName: "{ Modal }", description: "Centered dialog with backdrop." },
  avatar: { name: "Avatar + AvatarGroup", usage: "<Avatar name=\"Sagar\" /> <AvatarGroup avatars={…} />", importName: "{ Avatar, AvatarGroup }", description: "Initials/image avatars, stacked group." },
  skeleton: { name: "Skeleton + Progress", usage: "<Skeleton className=\"h-4 w-40\" /> <Progress value={70} />", importName: "{ Skeleton, Progress }", description: "Loading placeholders + progress bar." },
  "empty-state": { name: "EmptyState", usage: "<EmptyState title=\"Nothing here\" action={…} />", importName: "{ EmptyState }", description: "Guided empty state." },
  breadcrumb: { name: "Breadcrumb", usage: "<Breadcrumb items={[{ label, href }]} />", importName: "{ Breadcrumb }", description: "Chevron-separated trail." },
  toast: { name: "Toast", usage: "const { toast } = useToast(); toast({ title: \"Saved\" });", importName: "{ ToastProvider, useToast }", description: "Notification system with four variants." },
};

const LEGACY_CORE = {
  button: { name: "Button", usage: "<Button variant=\"primary\" size=\"lg\">Label</Button>", importName: "{ Button }", description: "Token-driven button, five sizes." },
  badge: { name: "Badge", usage: "<Badge variant=\"success\" dot>Live</Badge>", importName: "{ Badge }", description: "Compact status chip." },
  card: { name: "Card", usage: "<Card padding=\"lg\" hover>…</Card>", importName: "{ Card }", description: "Responsive surface container." },
};

/* ------------------------------- paid kits ------------------------------- */

const KIT_ENTRIES = [
  { id: "chat-canvas", name: "ChatCanvas", pkg: "@vaultui/ai-chat", importName: "{ ChatCanvas }" },
  { id: "chat-input", name: "ChatInput", pkg: "@vaultui/ai-chat", importName: "{ ChatInput }" },
  { id: "token-streamer", name: "TokenStreamer", pkg: "@vaultui/ai-chat", importName: "{ TokenStreamer }" },
  { id: "kpi-card", name: "KpiCard", pkg: "@vaultui/data-viz", importName: "{ KpiCard }" },
  { id: "sankey-diagram", name: "SankeyDiagram", pkg: "@vaultui/data-viz", importName: "{ SankeyDiagram }" },
  { id: "heatmap-calendar", name: "HeatmapCalendar", pkg: "@vaultui/data-viz", importName: "{ HeatmapCalendar }" },
  { id: "cart-drawer", name: "CartDrawer", pkg: "@vaultui/commerce", importName: "{ CartDrawer }" },
  { id: "pricing-table", name: "PricingTable", pkg: "@vaultui/commerce", importName: "{ PricingTable }" },
  { id: "log-stream", name: "LogStream", pkg: "@vaultui/dev-tools", importName: "{ LogStream }" },
  { id: "sql-builder", name: "SqlBuilder", pkg: "@vaultui/dev-tools", importName: "{ SqlBuilder }" },
  { id: "kanban-board", name: "KanbanBoard", pkg: "@vaultui/project", importName: "{ KanbanBoard }" },
  { id: "gantt-chart", name: "GanttChart", pkg: "@vaultui/project", importName: "{ GanttChart }" },
  { id: "presence-list", name: "PresenceList", pkg: "@vaultui/collab", importName: "{ PresenceList }" },
  { id: "live-cursors", name: "LiveCursors", pkg: "@vaultui/collab", importName: "{ LiveCursors }" },
];

/* --------------------------------- build --------------------------------- */

function embed(files) {
  return files.map((rel) => {
    const abs = path.join(repoRoot, rel);
    return {
      path: rel.replace(/^packages\/ui\/src\//, "src/components/vault/"),
      content: fs.readFileSync(abs, "utf8"),
    };
  });
}

const entries = [];

for (const [id, meta] of Object.entries(LEGACY_CORE)) {
  entries.push({
    id,
    name: meta.name,
    tier: "free",
    package: "@vaultui/ui",
    importName: meta.importName,
    usage: meta.usage,
    description: meta.description,
    files: embed(CORE_FILES[id]),
    via: "source",
  });
}

for (const [id, meta] of Object.entries(CORE_META)) {
  entries.push({
    id,
    name: meta.name,
    tier: "free",
    package: "@vaultui/ui",
    importName: meta.importName,
    usage: meta.usage,
    description: meta.description,
    files: embed(CORE_FILES[id]),
    via: "source",
  });
}

for (const k of KIT_ENTRIES) {
  entries.push({
    id: k.id,
    name: k.name,
    tier: "paid",
    package: k.pkg,
    importName: k.importName,
    usage: `import ${k.importName} from "${k.pkg}";`,
    description: `Paid kit component — installs via the ${k.pkg} package (commercial license).`,
    files: [],
    via: "package",
  });
}

const registry = {
  name: "@vaultui/registry",
  version: "0.1.0",
  description: "Vault UI component registry — consumed by the vault-ui CLI.",
  components: entries,
};

const json = JSON.stringify(registry, null, 2) + "\n";
fs.writeFileSync(path.join(repoRoot, "registry.json"), json);
fs.mkdirSync(path.join(repoRoot, "apps", "web", "public"), { recursive: true });
fs.writeFileSync(path.join(repoRoot, "apps", "web", "public", "registry.json"), json);
console.log(`registry.json written (${entries.length} components)`);