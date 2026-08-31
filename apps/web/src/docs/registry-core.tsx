import { useState } from "react";
import {
  Accordion,
  AlertDialog,
  Avatar,
  AvatarGroup,
  Breadcrumb,
  Calendar,
  Checkbox,
  CodeBlock,
  Combobox,
  CopyButton,
  DataTable,
  DropdownMenu,
  EmptyState,
  Field,
  Input,
  Kbd,
  Modal,
  Progress,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Stepper,
  Switch,
  Tabs,
  Textarea,
  ToastProvider,
  useToast,
} from "@vaultui/ui";
import type { ComponentGroup } from "./types";

/* ============================== demo helpers ============================== */

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-wrap items-center gap-6">
      <label className="flex items-center gap-2.5 text-sm text-surface-700">
        <Switch checked={on} onCheckedChange={setOn} />
        {on ? "Enabled" : "Disabled"}
      </label>
      <label className="flex items-center gap-2.5 text-sm text-surface-700">
        <Switch defaultChecked={false} size="sm" />
        Compact
      </label>
      <label className="flex items-center gap-2.5 text-sm text-surface-400">
        <Switch defaultChecked={true} disabled />
        Locked
      </label>
    </div>
  );
}

function InputDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Email address" hint="We'll never share it.">
        <Input placeholder="you@company.com" />
      </Field>
      <Field label="Project name" error="This field is required">
        <Input placeholder="Customer dashboard" aria-invalid="true" defaultValue="Bad value!" />
      </Field>
      <Field label="Team size">
        <Select
          placeholder="Choose an option"
          options={[
            { label: "1–10", value: "small" },
            { label: "11–50", value: "mid" },
            { label: "50+", value: "large" },
          ]}
        />
      </Field>
      <Field label="Notes">
        <Textarea placeholder="Anything else?" rows={3} />
      </Field>
    </div>
  );
}

function CheckboxDemo() {
  const [value, setValue] = useState("monthly");
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10">
      <div className="flex flex-col gap-2.5">
        <Checkbox defaultChecked>Email me product updates</Checkbox>
        <Checkbox>Enable two-factor auth</Checkbox>
        <Checkbox disabled>Legacy plan (locked)</Checkbox>
      </div>
      <RadioGroup
        value={value}
        onValueChange={setValue}
        options={[
          { label: "Monthly — $19/mo", value: "monthly" },
          { label: "Yearly — $190/yr (save 17%)", value: "yearly" },
          { label: "Lifetime — $499 one-time", value: "lifetime" },
        ]}
      />
    </div>
  );
}

function TabsDemo() {
  return (
    <Tabs
      defaultValue="code"
      tabs={[
        { id: "code", label: "Code", content: "The token-driven source — one theme file drives every component's color, radius, shadow and motion." },
        { id: "preview", label: "Preview", content: "Live preview re-skins with the theme dropdown — Neumorphic, Glassmorphism, Dimensional Layering, Vintage Retro Film." },
        { id: "api", label: "API", content: "Every prop is documented on the API table below — types, defaults and descriptions." },
      ]}
    />
  );
}

function AccordionDemo() {
  return (
    <Accordion
      items={[
        { title: "Is Vault UI framework-agnostic?", content: "Built for React 18 + Tailwind v4. The tokens and primitives are plain CSS, so the design system can drop into any stack." },
        { title: "Do premium kits need a license?", content: "Yes — premium kits ship under a commercial license; the free core (this kit) is MIT on the public registry." },
        { title: "Can I restyle everything?", content: "Everything reads CSS variables. Swap --color-brand-600 and the whole library re-brands — no per-component edits." },
      ]}
    />
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="vault-btn vault-btn-primary vault-btn-sm">
        Open dialog
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmation"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="vault-btn vault-btn-ghost vault-btn-sm">
              Cancel
            </button>
            <button type="button" onClick={() => setOpen(false)} className="vault-btn vault-btn-primary vault-btn-sm">
              Confirm
            </button>
          </>
        }
      >
        <p>This is a token-driven modal — dimmed backdrop, focus on ESC, scroll lock while open.</p>
      </Modal>
    </>
  );
}

function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar name="Sagar Babu" size="lg" />
      <Avatar name="Priya R" size="md" src="https://i.pravatar.cc/80?img=5" />
      <AvatarGroup
        size="md"
        avatars={[
          { name: "Ana M", src: "https://i.pravatar.cc/80?img=47" },
          { name: "Dev K", src: "https://i.pravatar.cc/80?img=12" },
          { name: "Leo T", src: "https://i.pravatar.cc/80?img=32" },
          { name: "Riya S" },
          { name: "Max O" },
        ]}
        max={4}
      />
    </div>
  );
}

function LoadingDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="flex flex-col gap-3 justify-center">
        <Progress value={38} />
        <Progress value={72} />
        <Progress value={100} />
      </div>
    </div>
  );
}

function EmptyDemo() {
  return (
    <EmptyState
      icon={<BoxIcon className="size-5" />}
      title="No components yet"
      body="Add components from the vault and this space fills with your curated kit."
      action={
        <button type="button" className="vault-btn vault-btn-secondary vault-btn-sm">
          Browse the vault
        </button>
      }
    />
  );
}

function CrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#" },
        { label: "Docs", href: "#" },
        { label: "Components" },
      ]}
    />
  );
}

function ToastDemoInner() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2.5">
      <button type="button" className="vault-btn vault-btn-secondary vault-btn-sm" onClick={() => toast({ title: "Saved", description: "Your changes are live.", variant: "success" })}>
        Success toast
      </button>
      <button type="button" className="vault-btn vault-btn-secondary vault-btn-sm" onClick={() => toast({ title: "Heads up", description: "Kit regenerated with 3 new components.", variant: "info" })}>
        Info toast
      </button>
      <button type="button" className="vault-btn vault-btn-secondary vault-btn-sm" onClick={() => toast({ title: "Failed", description: "Could not reach the registry.", variant: "error" })}>
        Error toast
      </button>
    </div>
  );
}

function ToastDemo() {
  return (
    <ToastProvider>
      <ToastDemoInner />
    </ToastProvider>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.5l9.75-4.5 9.75 4.5M12 12.75v6.75m0-6.75l-9.75-4.5M12 12.75l9.75-4.5M3.75 12.75v4.5a.75.75 0 00.37.65l7.13 4.1a.75.75 0 00.75 0l7.13-4.1a.75.75 0 00.37-.65v-4.5" />
    </svg>
  );
}

/* ================================ registry ================================ */


function DropdownMenuDemo() {
  return (
    <DropdownMenu
      trigger={
        <button type="button" className="vault-btn vault-btn-secondary vault-btn-sm">
          Actions ▾
        </button>
      }
      items={[
        { label: "Add to project", icon: <PlusIcon /> },
        { label: "Duplicate" },
        { separator: true },
        { label: "Delete", danger: true, onSelect: () => undefined },
      ]}
    />
  );
}

function SliderDemo() {
  const [v, setV] = useState(64);
  return (
    <div className="mx-auto max-w-sm space-y-4">
      <Slider label="Temperature" min={0} max={100} value={v} onChange={setV} />
      <Slider label="Volume" min={0} max={100} value={30} onChange={() => undefined} className="opacity-60" />
    </div>
  );
}

function ComboboxDemo() {
  const frameworks = [
    { label: "React", value: "react", keywords: ["jsx", "frontend"] },
    { label: "Vue", value: "vue", keywords: ["frontend"] },
    { label: "Svelte", value: "svelte", keywords: ["compiler"] },
    { label: "Solid", value: "solid", keywords: ["signals"] },
    { label: "Qwik", value: "qwik", keywords: ["resumable"] },
  ];
  const [v, setV] = useState<string | undefined>(undefined);
  return (
    <div className="mx-auto max-w-sm">
      <Combobox options={frameworks} value={v} onValueChange={setV} placeholder="Pick a framework…" />
    </div>
  );
}

function StepperDemo() {
  const [cur, setCur] = useState(1);
  return (
    <div className="space-y-5">
      <Stepper
        current={cur}
        steps={[
          { label: "Create", description: "Name your project" },
          { label: "Add", description: "Pick components" },
          { label: "Download", description: "Export the kit" },
        ]}
      />
      <div className="flex justify-center gap-2">
        <button type="button" className="vault-btn vault-btn-secondary vault-btn-sm" onClick={() => setCur((c) => Math.max(0, c - 1))}>
          Back
        </button>
        <button type="button" className="vault-btn vault-btn-primary vault-btn-sm" onClick={() => setCur((c) => Math.min(2, c + 1))}>
          Next
        </button>
      </div>
    </div>
  );
}

function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="vault-btn vault-btn-danger vault-btn-sm" onClick={() => setOpen(true)}>
        Delete project
      </button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete this project?"
        description="This removes the project and every component you added to it. This can't be undone."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}

const TABLE_ROWS = [
  { component: "ChatCanvas", kit: "AI Agent", downloads: 4820, price: "$49" },
  { component: "SankeyDiagram", kit: "Data Viz", downloads: 2109, price: "$49" },
  { component: "PricingTable", kit: "Commerce", downloads: 3304, price: "$49" },
  { component: "Switch", kit: "Core", downloads: 12400, price: "Free" },
  { component: "KanbanBoard", kit: "Project", downloads: 1512, price: "$49" },
  { component: "LiveCursors", kit: "Collab", downloads: 648, price: "$129" },
  { component: "HeroSection", kit: "Marketing", downloads: 987, price: "$49" },
  { component: "Toast", kit: "Core", downloads: 9021, price: "Free" },
  { component: "BarChart", kit: "Data Viz", downloads: 7760, price: "$49" },
];

function DataTableDemo() {
  return (
    <DataTable
      pageSize={6}
      columns={[
        { key: "component", label: "Component", sortable: true },
        { key: "kit", label: "Kit", sortable: true },
        { key: "downloads", label: "Downloads", sortable: true, align: "right" },
        { key: "price", label: "Price", sortable: true },
      ]}
      rows={TABLE_ROWS}
    />
  );
}

function CodeBlockDemo() {
  const code = `import { Button } from "@vaultui/ui";

export function Hero() {
  return (
    <Button size="lg" variant="primary" leadingIcon={<Arrow />}>
      Get started
    </Button>
  );
}`;
  return <CodeBlock code={code} language="tsx" title="Hero.tsx" />;
}

function CalendarDemo() {
  const [date, setDate] = useState(new Date());
  return (
    <div className="mx-auto max-w-xs">
      <Calendar value={date} onSelect={setDate} />
    </div>
  );
}

function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd>⌘K</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>J</Kbd>
      <Kbd>↵</Kbd>
    </div>
  );
}

function CopyButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton value="pnpm add @vaultui/ui" label="Copy install command" />
      <CopyButton value="const answer = 42;" size="md" />
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const demos: Record<string, React.ReactNode> = {
  switch: <SwitchDemo />,
  input: <InputDemo />,
  "radio-group": <CheckboxDemo />,
  tabs: <TabsDemo />,
  accordion: <AccordionDemo />,
  modal: <ModalDemo />,
  avatar: <AvatarDemo />,
  skeleton: <LoadingDemo />,
  "empty-state": <EmptyDemo />,
  breadcrumb: <CrumbDemo />,
  toast: <ToastDemo />,
  "dropdown-menu": <DropdownMenuDemo />,
  slider: <SliderDemo />,
  combobox: <ComboboxDemo />,
  stepper: <StepperDemo />,
  "alert-dialog": <AlertDialogDemo />,
  "data-table": <DataTableDemo />,
  "code-block": <CodeBlockDemo />,
  calendar: <CalendarDemo />,
  kbd: <KbdDemo />,
  "copy-button": <CopyButtonDemo />,
};

const entries = [
  {
    id: "switch",
    name: "Switch",
    description: "Token-driven toggle with sm/md sizes, controlled or uncontrolled, disabled state.",
    importName: "{ Switch }",
    usage: "<Switch checked={on} onCheckedChange={setOn} />",
    props: [
      { name: "checked / onCheckedChange", type: "boolean / (b) => void", description: "Controlled mode." },
      { name: "defaultChecked", type: "boolean", default: "false", description: "Uncontrolled initial state." },
      { name: "size", type: "\"sm\" | \"md\"", default: "\"md\"", description: "Compact vs default." },
    ],
  },
  {
    id: "input",
    name: "Input + Field",
    description: "Form controls: input, textarea, select — wrapped by a label/hint/error Field.",
    importName: "{ Input, Textarea, Select, Field }",
    usage: "<Field label=\"Email\"><Input placeholder=\"you@company.com\" /></Field>",
    props: [
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Height and font scale." },
      { name: "aria-invalid", type: "boolean", description: "Shows the error border." },
      { name: "options", type: "{ label, value }[]", description: "Select choices." },
    ],
  },
  {
    id: "radio-group",
    name: "Checkbox + RadioGroup",
    description: "Uncontrolled-friendly checkbox and radio group with focus rings and disabled states.",
    importName: "{ Checkbox, RadioGroup }",
    usage: "<Checkbox defaultChecked>Label</Checkbox>\n<RadioGroup value={v} onValueChange={setV} options={options} />",
    props: [
      { name: "options", type: "RadioOption[]", description: "label / value / disabled per option." },
      { name: "value / onValueChange", type: "string / (s) => void", description: "Controlled radio group." },
    ],
  },
  {
    id: "tabs",
    name: "Tabs",
    description: "Pill tabs (inset track, raised active) with a lazy-swapped panel.",
    importName: "{ Tabs }",
    usage: "<Tabs defaultValue=\"code\" tabs={[{ id: \"code\", label: \"Code\", content }]} />",
    props: [
      { name: "tabs", type: "TabItem[]", description: "id / label / content / disabled." },
      { name: "defaultValue / value / onValueChange", type: "string", description: "Controlled or not." },
    ],
  },
  {
    id: "accordion",
    name: "Accordion",
    description: "Single- or multi-open accordion with a smooth grid-rows expand animation.",
    importName: "{ Accordion }",
    usage: "<Accordion items={[{ title, content }]} multiple />",
    props: [
      { name: "items", type: "AccordionItem[]", description: "title + content nodes." },
      { name: "multiple", type: "boolean", default: "false", description: "Allow several open at once." },
    ],
  },
  {
    id: "modal",
    name: "Modal",
    description: "Centered dialog: dimmed backdrop, ESC + backdrop close, scroll lock, footer slot.",
    importName: "{ Modal }",
    usage: "<Modal open onClose title=\"Confirm\" footer={<Button>OK</Button>}>…</Modal>",
    props: [
      { name: "open", type: "boolean", description: "Show/hide." },
      { name: "onClose", type: "() => void", description: "ESC, backdrop or close button." },
      { name: "footer", type: "ReactNode", description: "Action row." },
    ],
  },
  {
    id: "avatar",
    name: "Avatar + AvatarGroup",
    description: "Initials or image avatar at three sizes; stacked group collapses into a +N tile.",
    importName: "{ Avatar, AvatarGroup }",
    usage: "<Avatar name=\"Sagar Babu\" size=\"lg\" />\n<AvatarGroup avatars={[{ name }]} max={4} />",
    props: [
      { name: "name", type: "string", description: "Initials source + alt/title." },
      { name: "src", type: "string", description: "Image URL — falls back to initials." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Box + text scale together." },
    ],
  },
  {
    id: "skeleton",
    name: "Skeleton + Progress",
    description: "Shimmer loading placeholders and a gradient progress bar with ARIA roles.",
    importName: "{ Skeleton, Progress }",
    usage: "<Skeleton className=\"h-4 w-40\" />\n<Progress value={70} />",
    props: [
      { name: "value", type: "number (0–100)", description: "Progress fill, clamped." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Bar thickness 4/8/12px." },
      { name: "className", type: "string", description: "Skeleton width/height." },
    ],
  },
  {
    id: "empty-state",
    name: "EmptyState",
    description: "Guided empty state — icon tile, title, body and an action slot.",
    importName: "{ EmptyState }",
    usage: "<EmptyState icon={…} title=\"Nothing here\" action={<Button>Browse</Button>} />",
    props: [
      { name: "icon", type: "ReactNode", description: "Tiled icon." },
      { name: "title / body", type: "string", description: "Copy." },
      { name: "action", type: "ReactNode", description: "Primary CTA." },
    ],
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Chevron-separated trail with link + current-page states.",
    importName: "{ Breadcrumb }",
    usage: "<Breadcrumb items={[{ label: \"Docs\", href: \"/docs\" }, { label: \"Components\" }]} />",
    props: [
      { name: "items", type: "Crumb[]", description: "label + optional href; last is the current page." },
    ],
  },
  {
    id: "toast",
    name: "Toast",
    description: "Notification system — provider + useToast, four variants, auto-dismiss, stacks to 5.",
    importName: "{ ToastProvider, useToast }",
    usage: "const { toast } = useToast();\ntoast({ title: \"Saved\", variant: \"success\" });",
    props: [
      { name: "title / description", type: "string", description: "Copy." },
      { name: "variant", type: "\"default\" | \"success\" | \"error\" | \"info\"", default: "\"default\"", description: "Icon + accent." },
      { name: "duration", type: "number", default: "4000", description: "Auto-dismiss ms." },
    ],
  },

  {
    id: "dropdown-menu",
    name: "DropdownMenu",
    description: "Trigger + menu — click-outside, ESC, arrow-key navigation, separators and danger items.",
    importName: "{ DropdownMenu }",
    usage: "<DropdownMenu trigger={<Button>Actions</Button>} items={[{ label: \"Rename\" }]} />",
    props: [
      { name: "items", type: "(MenuItem | separator)[]", description: "label / icon / onSelect / danger." },
      { name: "align", type: "\"start\" | \"end\"", default: "\"end\"", description: "Panel alignment." },
    ],
  },
  {
    id: "slider",
    name: "Slider",
    description: "Token-gradient range slider with fill track, keyboard-accessible and disabled state.",
    importName: "{ Slider }",
    usage: "<Slider min={0} max={100} value={v} onChange={setV} label=\"Volume\" />",
    props: [
      { name: "value / onChange", type: "number / (n) => void", description: "Controlled value." },
      { name: "min / max / step", type: "number", description: "Range." },
    ],
  },
  {
    id: "combobox",
    name: "Combobox",
    description: "Searchable select — type to filter, arrows + Enter to pick, ESC to close.",
    importName: "{ Combobox }",
    usage: "<Combobox options={[{ label, value }]} value={v} onValueChange={setV} />",
    props: [
      { name: "options", type: "{ label, value, keywords? }[]", description: "Choices." },
      { name: "value / onValueChange", type: "string | undefined", description: "Controlled selection." },
    ],
  },
  {
    id: "stepper",
    name: "Stepper",
    description: "Multi-step progress — numbered nodes, done checks, active highlight.",
    importName: "{ Stepper }",
    usage: "<Stepper current={1} steps={[{ label: \"Create\" }, { label: \"Add\" }]} />",
    props: [{ name: "current", type: "number (0-based)", description: "Active step." }],
  },
  {
    id: "alert-dialog",
    name: "AlertDialog",
    description: "Destructive-confirm dialog on top of Modal — danger icon, confirm/cancel actions.",
    importName: "{ AlertDialog }",
    usage: "<AlertDialog open onClose onConfirm title=\"Delete?\" danger />",
    props: [
      { name: "open / onClose / onConfirm", type: "boolean / fns", description: "Controls." },
      { name: "danger", type: "boolean", default: "true", description: "Danger confirm button." },
    ],
  },
  {
    id: "data-table",
    name: "DataTable",
    description: "Sortable, paginated table — header sorting, custom cells, empty state, totals footer.",
    importName: "{ DataTable }",
    usage: "<DataTable columns={[{ key, label, sortable }]} rows={rows} pageSize={8} />",
    props: [
      { name: "columns", type: "{ key, label, sortable?, render? }[]", description: "Schema." },
      { name: "pageSize", type: "number", default: "8", description: "Rows per page (0 = none)." },
      { name: "sortable", type: "boolean", default: "true", description: "Enable header sorting." },
    ],
  },
  {
    id: "code-block",
    name: "CodeBlock",
    description: "Dependency-free syntax-highlighted code window with copy — keywords, strings, comments, numbers.",
    importName: "{ CodeBlock }",
    usage: "<CodeBlock code={snippet} language=\"tsx\" title=\"Hero.tsx\" />",
    props: [
      { name: "code", type: "string", description: "Source to highlight + copy." },
      { name: "title / language", type: "string", description: "Header label." },
      { name: "copyable", type: "boolean", default: "true", description: "Copy action." },
    ],
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Month grid with prev/next nav, today ring, selection highlight and any week start.",
    importName: "{ Calendar }",
    usage: "<Calendar value={date} onSelect={setDate} />",
    props: [
      { name: "value / onSelect", type: "Date / (d) => void", description: "Selected day." },
      { name: "weekStart", type: "number", default: "0", description: "First weekday (0=Sun)." },
    ],
  },
  {
    id: "kbd",
    name: "Kbd",
    description: "Keyboard-key chip for shortcut hints.",
    importName: "{ Kbd }",
    usage: "<Kbd>⌘K</Kbd>",
    props: [],
  },
  {
    id: "copy-button",
    name: "CopyButton",
    description: "Clipboard button with a copied state — install it anywhere you show snippets.",
    importName: "{ CopyButton }",
    usage: "<CopyButton value=\"pnpm add @vaultui/ui\" />",
    props: [{ name: "value", type: "string", description: "Text to copy." }],
  },
].map((e) => ({ ...e, package: "@vaultui/ui", tier: "free" as const, demo: demos[e.id] }));

/** Merge into the existing "Free tier" group in the docs registry. */
export const CORE_GROUPS: ComponentGroup[] = [{ group: "Free tier", items: entries }];