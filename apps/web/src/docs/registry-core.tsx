import { useState } from "react";
import {
  Accordion,
  Avatar,
  AvatarGroup,
  Breadcrumb,
  Checkbox,
  EmptyState,
  Field,
  Input,
  Modal,
  Progress,
  RadioGroup,
  Select,
  Skeleton,
  Switch,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
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
].map((e) => ({ ...e, package: "@vaultui/ui", tier: "free" as const, demo: demos[e.id] }));

/** Merge into the existing "Free tier" group in the docs registry. */
export const CORE_GROUPS: ComponentGroup[] = [{ group: "Free tier", items: entries }];