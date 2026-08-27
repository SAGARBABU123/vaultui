import { useState } from "react";
import { Badge, Button, Card } from "@vault/ui";
import {
  AgentOrchestrationCanvas,
  ChatCanvas,
  ChatInput,
  ConstraintBadge,
  MemoryTimeline,
  ModelPicker,
  PromptPlayground,
  SourceCitation,
  TokenStreamer,
  ToolCallInspector,
  TypingIndicator,
  type AgentGraph,
  type ChatMessage,
  type MemoryEntry,
  type ModelOption,
  type PromptVariant,
  type SourceCitationItem,
} from "@vault/ai-chat";
import {
  AnimatedCounter,
  HeatmapCalendar,
  KpiCard,
  ProgressRadial,
  Sparkline,
} from "@vault/data-viz";
import {
  CartDrawer,
  InstallmentToggle,
  InventoryChip,
  PricingTable,
  RefundWizard,
  type CartItem,
  type PricingFeature,
  type PricingPlan,
  type UpsellItem,
} from "@vault/commerce";
import {
  ApiPlayground,
  DiffViewer,
  FeatureFlagBoard,
  LogStream,
  type FeatureFlag,
  type LogEntry,
} from "@vault/dev-tools";
import {
  GanttChart,
  KanbanBoard,
  RoadmapTimeline,
  type KanbanColumn,
  type RoadmapItem,
} from "@vault/project";
import type { ComponentGroup } from "./types";

/* =============================== demo constants ============================== */

const CHAT_MESSAGES: ChatMessage[] = [
  { id: "u1", role: "user", content: "How do I stream a response?" },
  {
    id: "a1",
    role: "assistant",
    streaming: true,
    content: `Wrap your messages in **ChatCanvas** and set \`streaming: true\` on the assistant message.\n\n- **TokenStreamer** reveals text token-by-token\n- Tool calls collapse into **ToolCallInspector** cards\n- **SourceCitation** chips footnotes the docs`,
    toolCalls: [
      {
        id: "t1",
        name: "search_docs",
        args: { query: "streaming", k: 2 },
        result: { hits: 2, top: "docs.vault.dev/chat-canvas" },
        status: "success",
      },
    ],
    sources: [
      { id: "s1", index: 1, title: "ChatCanvas API", domain: "docs.vault.dev" },
      { id: "s2", index: 2, title: "TokenStreamer", domain: "docs.vault.dev" },
    ],
  },
];

const AI_MODELS: ModelOption[] = [
  { id: "mini", label: "Vault Mini", context: "64k", badge: "Fast" },
  { id: "pro", label: "Vault Pro", context: "128k", badge: "Best" },
  { id: "max", label: "Vault Max", context: "1M", badge: "Preview" },
];

const MEMORY_ENTRIES: MemoryEntry[] = [
  { id: "m1", type: "preference", title: "Prefers TypeScript strict mode", detail: "noUncheckedIndexedAccess is always on.", confidence: 0.95, timestamp: "2h" },
  { id: "m2", type: "fact", title: "Uses Vite 5 + Tailwind v4", detail: "Token-driven theming.", confidence: 0.9, timestamp: "4h" },
  { id: "m3", type: "task", title: "Fix landing buttons", detail: "Shipped the xs→xl scale.", confidence: 0.7, timestamp: "1d" },
];

const AGENT_GRAPH: AgentGraph = {
  id: "run-1",
  name: "Build Fixer Agent",
  model: "Vault Pro",
  latencyMs: 4820,
  costUsd: 0.0123,
  batches: [
    [{ id: "in", kind: "input", label: "User request", detail: "Fix failing build", status: "success" }],
    [{ id: "pl", kind: "agent", label: "Planner", detail: "2 tools needed", status: "success", durationMs: 410 }],
    [
      { id: "t1", kind: "tool", label: "search_issues", detail: "build-error #341", status: "success", durationMs: 720 },
      { id: "t2", kind: "tool", label: "get_logs", detail: "pipeline tail", status: "running" },
    ],
    [{ id: "out", kind: "output", label: "Fixed", detail: "Build green", status: "success" }],
  ],
};

const PLAYGROUND_VARIANTS: PromptVariant[] = [
  {
    id: "a",
    name: "A",
    system: "You are a senior React + Tailwind engineer. Answer with responsive-first code.",
    user: "Build a Card that works on mobile and desktop.",
    response: "Use responsive padding:\n\n```tsx\n<div className=\"rounded-2xl border border-surface-200 p-4 sm:p-6 shadow-soft\">\n  ...\n</div>\n```\n\n16px on phones, 24px at sm+.",
    meta: { tokens: 148, latencyMs: 830, costUsd: 0.0004 },
  },
  {
    id: "b",
    name: "B",
    system: "You are concise. Code-only answers.",
    user: "Build a Card that works on mobile and desktop.",
    response: "```tsx\n<div className=\"rounded-2xl border p-4 sm:p-6 shadow-soft\">\n  {children}\n</div>\n```",
    meta: { tokens: 52, latencyMs: 610, costUsd: 0.0002 },
  },
  {
    id: "c",
    name: "C",
    system: "Explain trade-offs and alternatives first.",
    user: "Build a Card that works on mobile and desktop.",
    response: "Static breakpoints (option 1) are more predictable than fluid clamp() padding for a component kit. Implementation: p-4 base + sm:p-6 upgrade — the same rule every Vault component follows.",
    meta: { tokens: 210, latencyMs: 1240, costUsd: 0.0006 },
  },
];

const FLAGS: FeatureFlag[] = [
  { id: "ai.streaming", description: "Token-by-token chat", rollout: 100, environments: { dev: true, staging: true, prod: true } },
  { id: "cart.upsell", description: "Cross-sell in cart", rollout: 40, environments: { dev: true, staging: false, prod: false } },
  { id: "viz.sparkline", description: "KPI sparklines", rollout: 15, environments: { dev: true, staging: true, prod: false } },
];

const LOG_ENTRIES: LogEntry[] = [
  { id: "l1", level: "info", message: "GET /v1/kits → 200", payload: { ms: 84 }, timestamp: "10:42:01" },
  { id: "l2", level: "debug", message: "token cache hit for ai-chat", timestamp: "10:42:03" },
  { id: "l3", level: "warn", message: "rate limit 85% on vault-pro", payload: { rpm: 51 }, timestamp: "10:42:07" },
  { id: "l4", level: "error", message: "POST /v1/refunds failed (502)", payload: { order: "VLT-1042" }, timestamp: "10:42:12" },
  { id: "l5", level: "info", message: "replayed stream #8841", payload: { tokens: 2048 }, timestamp: "10:42:19" },
];

const BOARD: KanbanColumn[] = [
  {
    id: "todo",
    title: "To do",
    wipLimit: 5,
    cards: [
      { id: "c1", title: "Publish kits to npm", tag: "release", tagColor: "brand" },
      { id: "c2", title: "Dark theme toggle", tag: "design", tagColor: "info" },
    ],
  },
  {
    id: "doing",
    title: "In progress",
    wipLimit: 3,
    cards: [{ id: "c3", title: "Docs explorer", tag: "ui", tagColor: "warning" }],
  },
  {
    id: "done",
    title: "Done",
    wipLimit: 8,
    cards: [
      { id: "c4", title: "Token engine", tag: "design", tagColor: "success" },
      { id: "c5", title: "Responsive Button", tag: "ui", tagColor: "success" },
    ],
  },
];

const ROADMAP: RoadmapItem[] = [
  { id: "r1", name: "Foundation", start: 0, end: 3, color: "success", status: "shipped", milestone: true },
  { id: "r2", name: "AI Agent Kit", start: 2, end: 6, color: "brand", status: "shipped" },
  { id: "r3", name: "Data Viz", start: 5, end: 8, color: "info", status: "in-progress" },
  { id: "r4", name: "Commerce", start: 7, end: 10, color: "warning", status: "planned" },
];

const GANTT_TASKS = [
  { id: "g1", name: "Design tokens", start: 0, end: 3, progress: 100, group: "Done" },
  { id: "g2", name: "AI streaming", start: 3, end: 7, progress: 100, group: "Build" },
  { id: "g3", name: "Sparkline", start: 6, end: 9, progress: 80, group: "QA" },
  { id: "g4", name: "Cart drawer", start: 8, end: 11, progress: 45, group: "Build" },
  { id: "g5", name: "Launch", start: 12, end: 14, progress: 10, group: "Planned" },
];

const DIFF_OLD = ["export function Badge() {", "  return <span className=\"bg-gray-100 text-gray-700\">x</span>;", "}"].join("\n");
const DIFF_NEW = ["export function Badge() {", "  return <span className=\"bg-brand-100 text-brand-700\">x</span>;", "}"].join("\n");

const CART_PLANS: PricingPlan[] = [
  { id: "free", name: "Free", price: "$0", period: "/ forever", cta: "Start free" },
  { id: "pro", name: "Pro", price: "$49", period: "/ once", cta: "Buy Pro", highlight: true },
  { id: "team", name: "Team", price: "$149", period: "/ once", cta: "Contact sales" },
];

const CART_FEATURES: PricingFeature[] = [
  { label: "Components", values: { free: "12", pro: "40+", team: "All kits" } },
  { label: "Token theming", values: { free: "Basic", pro: true, team: true } },
  { label: "Source access", values: { free: false, pro: true, team: true } },
  { label: "Seats", values: { free: "1", pro: "1", team: "5" } },
];

/* ============================= stateful demos ============================== */

function ChatInputDemo() {
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="space-y-3">
      <ChatInput onSend={(t) => setSent((s) => [...s, t])} placeholder="Type a message…" suggestions={["Stream it", "Be concise"]} />
      {sent.length > 0 && (
        <ul className="space-y-1">
          {sent.map((s, i) => (
            <li key={i} className="rounded-lg bg-surface-100 px-3 py-1.5 text-sm text-surface-600">
              Sent: {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CartDemo() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    { id: "k1", name: "AI Agent Kit — Pro", price: 49, qty: 1, emoji: "🤖" },
    { id: "k2", name: "Data Viz Pro", price: 39, qty: 1, emoji: "📈" },
  ]);
  const upsell: UpsellItem = { id: "u1", name: "Commerce Kit", price: 39, emoji: "🛒" };
  return (
    <>
      <Button leadingIcon={<BagIcon />} onClick={() => setOpen(true)}>
        Open cart
      </Button>
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={cart}
        upsell={upsell}
        onAddUpsell={(u) => setCart((c) => (c.some((i) => i.id === u.id) ? c : [...c, { ...u, qty: 1 }]))}
        onQtyChange={(id, qty) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty } : i)))}
        onRemove={(id) => setCart((c) => c.filter((i) => i.id !== id))}
        onCheckout={() => setOpen(false)}
      />
    </>
  );
}

function ModelDemo() {
  const [value, setValue] = useState(AI_MODELS[0]!.id);
  return <ModelPicker models={AI_MODELS} value={value} onChange={setValue} />;
}

function FlagDemo() {
  return <FeatureFlagBoard flags={FLAGS} />;
}

function BoardDemo() {
  return <KanbanBoard columns={BOARD} />;
}

/* ================================= registry ================================ */

export const COMPONENT_GROUPS: ComponentGroup[] = [
  {
    group: "Start",
    items: [
      {
        id: "overview",
        name: "Overview",
        package: "—",
        tier: "free",
        description: "Vault UI: 30 premium React + Tailwind components in five kits — the ones standard libraries don't ship. Every component is responsive-first, token-driven, and dependency-light. Free tier (Button, Badge, Card) is MIT; kits are commercial.",
        importName: "—",
        usage: "pnpm add @vault/tokens @vault/ui\n# then, in your CSS:\n@import \"@vault/tokens/tokens.css\";",
        props: [],
        demo: (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { emoji: "🤖", name: "AI Agent Kit", desc: "11 components", color: "bg-brand-100" },
              { emoji: "📈", name: "Data Viz Pro", desc: "5 components", color: "bg-info-100" },
              { emoji: "🛒", name: "Commerce Kit", desc: "5 components", color: "bg-warning-100" },
              { emoji: "🧰", name: "Dev Tools Kit", desc: "4 components", color: "bg-surface-200" },
              { emoji: "🗂️", name: "Project Kit", desc: "3 components", color: "bg-success-100" },
            ].map((k) => (
              <div key={k.name} className={`rounded-xl ${k.color} p-4`}>
                <div className="text-2xl">{k.emoji}</div>
                <p className="mt-2 text-sm font-semibold">{k.name}</p>
                <p className="text-xs text-surface-500">{k.desc}</p>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    group: "Free tier",
    items: [
      {
        id: "button",
        name: "Button",
        package: "@vault/ui",
        tier: "free",
        description: "Token-driven button with five sizes (xs → xl), four variants, icons, loading and full-width states.",
        importName: "{ Button }",
        usage: "<Button variant=\"secondary\" size=\"lg\" leadingIcon={<Icon />}>\n  Label\n</Button>",
        props: [
          { name: "variant", type: "\"primary\" | \"secondary\" | \"ghost\" | \"danger\"", default: "\"primary\"", description: "Visual style." },
          { name: "size", type: "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"", default: "\"md\"", description: "Height scale; sm is the minimum touch target." },
          { name: "leadingIcon / trailingIcon", type: "ReactNode", description: "Icon before/after the label." },
          { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and disables." },
          { name: "fullWidth", type: "boolean", default: "false", description: "w-full — pair with \"w-full sm:w-auto\" for responsive CTAs." },
        ],
        demo: (
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" fullWidth className="sm:w-auto">
              Full width on mobile
            </Button>
          </div>
        ),
      },
      {
        id: "badge",
        name: "Badge",
        package: "@vault/ui",
        tier: "free",
        description: "Compact status chip with six tonal variants and an optional status dot.",
        importName: "{ Badge }",
        usage: "<Badge variant=\"success\" dot>Live</Badge>",
        props: [
          { name: "variant", type: "\"neutral\" | \"brand\" | \"success\" | \"warning\" | \"danger\" | \"info\"", default: "\"neutral\"", description: "Tonal background + foreground." },
          { name: "dot", type: "boolean", default: "false", description: "Status dot before the label." },
          { name: "size", type: "\"sm\" | \"md\"", default: "\"md\"", description: "Compact vs default." },
        ],
        demo: (
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Neutral</Badge>
            <Badge variant="brand" dot>Brand</Badge>
            <Badge variant="success" dot>Live</Badge>
            <Badge variant="warning" dot>Warning</Badge>
            <Badge variant="danger" dot>Failed</Badge>
            <Badge variant="info" dot>New</Badge>
            <Badge size="sm">Small</Badge>
          </div>
        ),
      },
      {
        id: "card",
        name: "Card",
        package: "@vault/ui",
        tier: "free",
        description: "Responsive surface container: padding scales at the sm breakpoint, elevation and hover lifts are props.",
        importName: "{ Card }",
        usage: "<Card padding=\"lg\" hover={true} className=\"lg:col-span-2\">\n  {children}\n</Card>",
        props: [
          { name: "padding", type: "\"none\" | \"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Inner padding (scales responsively)." },
          { name: "shadow", type: "\"none\" | \"soft\" | \"raised\"", default: "\"soft\"", description: "Elevation." },
          { name: "bordered", type: "boolean", default: "true", description: "Show the border." },
          { name: "hover", type: "boolean", default: "false", description: "Border tint on hover." },
        ],
        demo: (
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <p className="text-sm font-semibold">Default</p>
              <p className="mt-1 text-sm text-surface-500">md padding, soft shadow.</p>
            </Card>
            <Card padding="lg" shadow="raised">
              <p className="text-sm font-semibold">Raised</p>
              <p className="mt-1 text-sm text-surface-500">lg padding, elevated.</p>
            </Card>
            <Card padding="lg" hover className="flex items-center justify-center">
              <p className="text-sm font-medium text-brand-600">hover lift →</p>
            </Card>
          </div>
        ),
      },
    ],
  },
  {
    group: "AI Agent Kit",
    items: [
      {
        id: "chat-canvas",
        name: "ChatCanvas",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Full conversation UI: streaming markdown, tool-call inspectors, source citations, typing indicator and auto-scroll.",
        importName: "{ ChatCanvas }",
        usage: "<ChatCanvas messages={messages} isTyping={busy} onStreamComplete={markDone} />",
        props: [
          { name: "messages", type: "ChatMessage[]", description: "User/assistant/system messages; assistant supports streaming, toolCalls, sources." },
          { name: "isTyping", type: "boolean", default: "false", description: "Pins the thinking indicator at the bottom." },
          { name: "speed", type: "number", default: "15", description: "ms per token while streaming." },
          { name: "onStreamComplete", type: "(id: string) => void", description: "Fired when a streaming message finishes." },
          { name: "heightClass", type: "string", default: "\"h-[420px] sm:h-[520px]\"", description: "Viewport height." },
        ],
        demo: <ChatCanvas messages={CHAT_MESSAGES} heightClass="h-[320px]" />,
      },
      {
        id: "chat-input",
        name: "ChatInput",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Auto-resizing prompt input: Enter to send (Shift+Enter newline), IME-safe, token estimate and suggestion chips.",
        importName: "{ ChatInput }",
        usage: "<ChatInput onSend={send} disabled={streaming} suggestions={[\"Make it responsive\"]} />",
        props: [
          { name: "onSend", type: "(text: string) => void", description: "Called with trimmed text on send." },
          { name: "disabled", type: "boolean", default: "false", description: "Block sending (e.g. while streaming)." },
          { name: "suggestions", type: "string[]", description: "Click-to-fill chips." },
          { name: "maxLength", type: "number", default: "4000", description: "Character cap." },
        ],
        demo: <ChatInputDemo />,
      },
      {
        id: "token-streamer",
        name: "TokenStreamer",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Reveals text token-by-token with a blinking caret — the LLM-typing effect. Exposes the useStreamingText hook.",
        importName: "{ TokenStreamer, useStreamingText }",
        usage: "<TokenStreamer text={answer} streaming speed={25} />",
        props: [
          { name: "text", type: "string", description: "Full text to reveal." },
          { name: "streaming", type: "boolean", default: "true", description: "When false, shows text instantly." },
          { name: "speed", type: "number", default: "25", description: "ms between tokens." },
          { name: "onComplete", type: "() => void", description: "Fired at the end of the reveal." },
        ],
        demo: (
          <div className="rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
            <TokenStreamer text="Watching tokens appear one at a time is the whole magic — streaming, streaming, streaming…" speed={22} />
          </div>
        ),
      },
      {
        id: "typing-indicator",
        name: "TypingIndicator",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Three bouncing dots with a screen-reader label — used under the hood by ChatCanvas.",
        importName: "{ TypingIndicator }",
        usage: "<TypingIndicator dots={3} label=\"Assistant is thinking\" />",
        props: [
          { name: "dots", type: "number", default: "3", description: "Number of dots." },
          { name: "label", type: "string", description: "aria-label / sr-only text." },
        ],
        demo: (
          <div className="flex items-center gap-6 rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
            <TypingIndicator />
            <TypingIndicator dots={5} />
            <TypographyNote />
          </div>
        ),
      },
      {
        id: "tool-call-inspector",
        name: "ToolCallInspector",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Collapsible JSON in/out for a single agent tool call, with Running / Success / Error state.",
        importName: "{ ToolCallInspector }",
        usage: "<ToolCallInspector name=\"search_docs\" args={{q: \"x\"}} result={{hits: 2}} status=\"success\" />",
        props: [
          { name: "name", type: "string", description: "Tool function name." },
          { name: "args / result", type: "unknown", description: "Serialized to pretty JSON." },
          { name: "status", type: "\"running\" | \"success\" | \"error\"", default: "\"success\"", description: "Header badge." },
          { name: "defaultOpen", type: "boolean", default: "false", description: "Expand on mount." },
        ],
        demo: (
          <div className="space-y-2">
            <ToolCallInspector name="search_docs" args={{ query: "streaming", k: 3 }} result={{ hits: 2, top: "docs.vault.dev" }} status="success" defaultOpen />
            <ToolCallInspector name="embed_context" args={{ source: "docs.vault.dev" }} status="running" />
          </div>
        ),
      },
      {
        id: "constraint-badge",
        name: "ConstraintBadge",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Live token / rate / cost / latency meters with usage bars and warn/danger tones.",
        importName: "{ ConstraintBadge }",
        usage: "<ConstraintBadge items={[{label: \"Tokens\", value: \"4.2k / 128k\", percent: 4}]} />",
        props: [
          { name: "items", type: "ConstraintItem[]", description: "Label, value, optional percent + tone + kind." },
          { name: "compact", type: "boolean", default: "false", description: "Hide labels on small screens." },
        ],
        demo: (
          <ConstraintBadge
            items={[
              { label: "Tokens", value: "4.2k / 128k", percent: 4 },
              { label: "Rate", value: "51 / 60 rpm", percent: 85, tone: "warn", kind: "rate" },
              { label: "Latency", value: "1.9s", kind: "latency" },
              { label: "Cost", value: "$0.0042", kind: "cost" },
            ]}
          />
        ),
      },
      {
        id: "source-citation",
        name: "SourceCitation",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Footnote chip for RAG answers — index stays visible while the title truncates on narrow screens.",
        importName: "{ SourceCitation }",
        usage: "<SourceCitation citation={{id: \"s1\", index: 1, title: \"Docs\", domain: \"docs.vault.dev\"}} active />",
        props: [
          { name: "citation", type: "SourceCitationItem", description: "id, index, title, optional domain." },
          { name: "active", type: "boolean", default: "false", description: "Filled state." },
        ],
        demo: (
          <div className="flex flex-wrap gap-2">
            {[
              { id: "s1", index: 1, title: "ChatCanvas API", domain: "docs.vault.dev" },
              { id: "s2", index: 2, title: "TokenStreamer API", domain: "docs.vault.dev" },
            ].map((c: SourceCitationItem) => (
              <SourceCitation key={c.id} citation={c} active={c.index === 1} />
            ))}
          </div>
        ),
      },
      {
        id: "model-picker",
        name: "ModelPicker",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Styled native select — fully accessible and opens the OS picker on mobile.",
        importName: "{ ModelPicker }",
        usage: "<ModelPicker models={models} value={model} onChange={setModel} />",
        props: [
          { name: "models", type: "ModelOption[]", description: "id, label, context, badge." },
          { name: "value", type: "string", description: "Selected model id." },
          { name: "onChange", type: "(id: string) => void", description: "Selection handler." },
        ],
        demo: <ModelDemo />,
      },
      {
        id: "memory-timeline",
        name: "MemoryTimeline",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "What the agent remembers — vertical timeline with per-type colors, confidence bars and timestamps.",
        importName: "{ MemoryTimeline }",
        usage: "<MemoryTimeline entries={memories} onSelect={openMemory} heightClass=\"h-[400px]\" />",
        props: [
          { name: "entries", type: "MemoryEntry[]", description: "Fact / preference / event / task with confidence." },
          { name: "heightClass", type: "string", default: "\"h-[360px]\"", description: "Scrollable viewport height." },
          { name: "onSelect", type: "(entry) => void", description: "Click handler." },
        ],
        demo: <MemoryTimeline entries={MEMORY_ENTRIES} heightClass="h-[260px]" />,
      },
      {
        id: "agent-canvas",
        name: "AgentOrchestrationCanvas",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Visual flow of an agent run — input → planner → parallel tool batches → output, with live status and cost.",
        importName: "{ AgentOrchestrationCanvas }",
        usage: "<AgentOrchestrationCanvas graph={graph} /> // graph.batches = AgentStep[][]",
        props: [
          { name: "graph", type: "AgentGraph", description: "name, model, latency, cost, and batches of AgentSteps." },
        ],
        demo: <AgentOrchestrationCanvas graph={AGENT_GRAPH} />,
      },
      {
        id: "prompt-playground",
        name: "PromptPlayground",
        package: "@vault/ai-chat",
        tier: "paid",
        description: "Iterate on prompts: editable system/user panes, temperature + max-tokens sliders, and an A/B compare view.",
        importName: "{ PromptPlayground }",
        usage: "<PromptPlayground variants={promptVariants} />",
        props: [
          { name: "variants", type: "PromptVariant[]", description: "name, system, user, response, meta." },
          { name: "heightClass", type: "string", default: "\"h-[360px] sm:h-[420px]\"", description: "Pane height." },
        ],
        demo: <PromptPlayground variants={PLAYGROUND_VARIANTS} heightClass="h-[300px]" />,
      },
    ],
  },
  {
    group: "Data Viz Pro",
    items: [
      {
        id: "kpi-card",
        name: "KpiCard",
        package: "@vault/data-viz",
        tier: "paid",
        description: "Label, animated value, delta badge (tone follows sign) and a gradient sparkline — no chart library.",
        importName: "{ KpiCard }",
        usage: "<KpiCard label=\"Revenue\" value={24890} delta={12.4} trend={series} format={(n) => `$${n.toLocaleString()}`} />",
        props: [
          { name: "label", type: "string", description: "Metric name." },
          { name: "value", type: "number", description: "Animated counter value." },
          { name: "delta", type: "number", description: "Percent change — colors the badge + line." },
          { name: "trend", type: "number[]", description: "Sparkline series." },
          { name: "format", type: "(n: number) => string", description: "Value formatter." },
        ],
        demo: (
          <div className="grid gap-3 sm:grid-cols-2">
            <KpiCard label="Revenue" value={24890} delta={12.4} format={(n) => `$${Math.round(n).toLocaleString()}`} trend={[12, 14, 13, 16, 18, 17, 21, 24]} hint="vs last month" />
            <KpiCard label="Refund rate" value={0.9} delta={-0.3} format={(n) => `${n.toFixed(1)}%`} trend={[1.4, 1.3, 1.1, 1.2, 1.0, 0.9]} hint="lower is better" />
          </div>
        ),
      },
      {
        id: "sparkline",
        name: "Sparkline",
        package: "@vault/data-viz",
        tier: "paid",
        description: "Dependency-free SVG trend line with gradient fill — crisp at any width via fixed aspect ratio.",
        importName: "{ Sparkline }",
        usage: "<Sparkline data={series} colorClass=\"text-success-500\" />",
        props: [
          { name: "data", type: "number[]", description: "Auto-scaled series." },
          { name: "colorClass", type: "string", default: "\"text-brand-600\"", description: "Line + gradient color." },
          { name: "fill", type: "boolean", default: "true", description: "Area gradient." },
          { name: "strokeWidth", type: "number", default: "2", description: "Line weight." },
        ],
        demo: (
          <div className="grid gap-4 sm:grid-cols-3">
            {(["text-brand-600", "text-success-500", "text-danger-500"] as const).map((c, i) => (
              <div key={c} className="space-y-1">
                <Sparkline data={[5, 8, 6, 9, 7, 10, 8, 11, 9, 12]} colorClass={c} className="aspect-[100/32]" />
                <p className="text-center text-xs text-surface-400">{["brand", "success", "danger"][i]}</p>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "animated-counter",
        name: "AnimatedCounter",
        package: "@vault/data-viz",
        tier: "paid",
        description: "Tweens to the target value with cubic ease-out via requestAnimationFrame; honors prefers-reduced-motion.",
        importName: "{ AnimatedCounter }",
        usage: "<AnimatedCounter value={1284} duration={900} format={(n) => Math.round(n).toLocaleString()} />",
        props: [
          { name: "value", type: "number", description: "Target number." },
          { name: "duration", type: "number", default: "800", description: "Animation length in ms." },
          { name: "format", type: "(n: number) => string", description: "Formatter." },
        ],
        demo: (
          <div className="flex items-end gap-6 rounded-xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
            <div>
              <p className="text-xs text-surface-400">Active users</p>
              <p className="text-3xl font-bold tracking-tight">
                <AnimatedCounter value={1284} />
              </p>
            </div>
            <div>
              <p className="text-xs text-surface-400">Revenue</p>
              <p className="text-3xl font-bold tracking-tight text-brand-600">
                <AnimatedCounter value={24890} format={(n) => `$${Math.round(n).toLocaleString()}`} />
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "progress-radial",
        name: "ProgressRadial",
        package: "@vault/data-viz",
        tier: "paid",
        description: "Round gauge with rounded caps, animated on mount and threshold-aware tones.",
        importName: "{ ProgressRadial }",
        usage: "<ProgressRadial value={78} tone=\"warning\" label=\"78%\" sublabel=\"Storage\" />",
        props: [
          { name: "value", type: "number", description: "0–100." },
          { name: "size", type: "number", default: "96", description: "Pixel size." },
          { name: "tone", type: "\"brand\" | \"success\" | \"warning\" | \"danger\"", default: "\"brand\"", description: "Arc color." },
          { name: "label / sublabel", type: "string", description: "Center text." },
        ],
        demo: (
          <div className="flex flex-wrap items-center justify-around gap-6 rounded-xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
            <ProgressRadial value={42} sublabel="CPU" />
            <ProgressRadial value={78} tone="warning" sublabel="Storage" />
            <ProgressRadial value={91} tone="danger" sublabel="Memory" />
            <ProgressRadial value={64} sublabel="Load" />
          </div>
        ),
      },
      {
        id: "heatmap-calendar",
        name: "HeatmapCalendar",
        package: "@vault/data-viz",
        tier: "paid",
        description: "GitHub-style activity heatmap with a token color scale that reflows to any width.",
        importName: "{ HeatmapCalendar }",
        usage: "<HeatmapCalendar values={activity} weeks={10} monthEvery={5} />",
        props: [
          { name: "values", type: "number[]", description: "Cell levels 0–max, column-major." },
          { name: "max", type: "number", default: "4", description: "Highest level." },
          { name: "weeks", type: "number", default: "10", description: "Columns." },
          { name: "monthEvery", type: "number", description: "Month label grouping." },
        ],
        demo: (
          <HeatmapCalendar values={Array.from({ length: 70 }, (_, i) => ((i * 7) % 11 + (i % 4)) % 5)} weeks={10} monthEvery={5} />
        ),
      },
    ],
  },
  {
    group: "Commerce Kit",
    items: [
      {
        id: "cart-drawer",
        name: "CartDrawer",
        package: "@vault/commerce",
        tier: "paid",
        description: "Slide-in cart with quantity steppers, cross-sell upsell banner, subtotal, Escape/backdrop close and scroll lock.",
        importName: "{ CartDrawer }",
        usage: "<CartDrawer open={open} onClose={close} items={cart} upsell={deal} onAddUpsell={add} onQtyChange={setQty} onRemove={drop} onCheckout={pay} />",
        props: [
          { name: "open / onClose", type: "boolean / () => void", description: "Visibility control." },
          { name: "items", type: "CartItem[]", description: "id, name, price, qty, emoji." },
          { name: "onQtyChange / onRemove", type: "handlers", description: "Cart mutations." },
          { name: "upsell", type: "UpsellItem", description: "Cross-sell banner." },
          { name: "onCheckout", type: "() => void", description: "Checkout CTA." },
        ],
        demo: <CartDemo />,
      },
      {
        id: "pricing-table",
        name: "PricingTable",
        package: "@vault/commerce",
        tier: "paid",
        description: "Side-by-side feature matrix with hover tooltips, highlighted popular column and mobile horizontal scroll.",
        importName: "{ PricingTable }",
        usage: "<PricingTable plans={plans} features={features} />",
        props: [
          { name: "plans", type: "PricingPlan[]", description: "name, price, period, cta, highlight." },
          { name: "features", type: "PricingFeature[]", description: "label, tooltip, values per plan (boolean | string)." },
        ],
        demo: <PricingTable plans={CART_PLANS} features={CART_FEATURES} />,
      },
      {
        id: "refund-wizard",
        name: "RefundWizard",
        package: "@vault/commerce",
        tier: "paid",
        description: "Multi-step refund flow (reason → method → review) with progress rail, radio cards and completion state.",
        importName: "{ RefundWizard }",
        usage: "<RefundWizard orderId=\"#VLT-1042\" amount={129} onComplete={(reason, method) => void} />",
        props: [
          { name: "orderId / amount / currency", type: "string / number / string", description: "Refund context." },
          { name: "onComplete", type: "(reason, method) => void", description: "Fired on confirm." },
        ],
        demo: <RefundWizard amount={129} />,
      },
      {
        id: "installment-toggle",
        name: "InstallmentToggle",
        package: "@vault/commerce",
        tier: "paid",
        description: "Pay-once vs interest-free monthly switcher with a breakdown list.",
        importName: "{ InstallmentToggle }",
        usage: "<InstallmentToggle price={49} months={6} />",
        props: [
          { name: "price", type: "number", description: "Full price." },
          { name: "months", type: "number", default: "4", description: "Installments (interest-free)." },
          { name: "currency", type: "string", default: "\"$\"", description: "Currency symbol." },
        ],
        demo: (
          <div className="rounded-xl border-0 bg-surface-100 shadow-inset p-4">
            <InstallmentToggle price={49} months={6} />
          </div>
        ),
      },
      {
        id: "inventory-chip",
        name: "InventoryChip",
        package: "@vault/commerce",
        tier: "paid",
        description: "Stock status that converts: 'In stock', 'Only 3 left', or a restock date.",
        importName: "{ InventoryChip }",
        usage: "<InventoryChip level=\"low\" count={3} />",
        props: [
          { name: "level", type: "\"in\" | \"low\" | \"out\"", description: "Status." },
          { name: "count", type: "number", description: "Remaining (low)." },
          { name: "restockDate", type: "string", description: "Shown when out." },
        ],
        demo: (
          <div className="flex flex-wrap gap-2">
            <InventoryChip level="in" />
            <InventoryChip level="low" count={3} />
            <InventoryChip level="out" restockDate="Mar 4" />
          </div>
        ),
      },
    ],
  },
  {
    group: "Dev Tools Kit",
    items: [
      {
        id: "diff-viewer",
        name: "DiffViewer",
        package: "@vault/dev-tools",
        tier: "paid",
        description: "Side-by-side LCS line diff with added/removed counts — zero dependencies.",
        importName: "{ DiffViewer }",
        usage: "<DiffViewer oldText={old} newText={new} oldLabel=\"main\" newLabel=\"feature\" language=\"tsx\" />",
        props: [
          { name: "oldText / newText", type: "string", description: "Inputs to diff (line-based LCS)." },
          { name: "oldLabel / newLabel", type: "string", default: "\"old\" / \"new\"", description: "Pane labels." },
          { name: "language", type: "string", default: "\"text\"", description: "Header hint." },
        ],
        demo: <DiffViewer oldText={DIFF_OLD} newText={DIFF_NEW} language="tsx" />,
      },
      {
        id: "log-stream",
        name: "LogStream",
        package: "@vault/dev-tools",
        tier: "paid",
        description: "Filterable log viewer with level chips, follow-tail auto-scroll and colorized JSON payloads.",
        importName: "{ LogStream }",
        usage: "<LogStream entries={logs} heightClass=\"h-80\" />",
        props: [
          { name: "entries", type: "LogEntry[]", description: "id, level, message, payload, timestamp." },
          { name: "heightClass", type: "string", default: "\"h-72 sm:h-80\"", description: "Viewport height." },
        ],
        demo: <LogStream entries={LOG_ENTRIES} heightClass="h-56" />,
      },
      {
        id: "api-playground",
        name: "ApiPlayground",
        package: "@vault/dev-tools",
        tier: "paid",
        description: "Mini-Postman: method, URL, headers and JSON body with a simulated response (status, latency, headers, body).",
        importName: "{ ApiPlayground }",
        usage: "<ApiPlayground baseUrl=\"https://api.example.com\" />",
        props: [
          { name: "baseUrl", type: "string", default: "\"https://api.vault.dev\"", description: "Prefilled in the URL bar." },
        ],
        demo: <ApiPlayground />,
      },
      {
        id: "feature-flags",
        name: "FeatureFlagBoard",
        package: "@vault/dev-tools",
        tier: "paid",
        description: "Rollout management: per-environment switches, rollout slider, and state summary.",
        importName: "{ FeatureFlagBoard }",
        usage: "<FeatureFlagBoard flags={flags} onChange={persist} />",
        props: [
          { name: "flags", type: "FeatureFlag[]", description: "id, description, rollout, environments." },
          { name: "onChange", type: "(flags) => void", description: "Persist copies." },
        ],
        demo: <FlagDemo />,
      },
    ],
  },
  {
    group: "Project Mgmt Kit",
    items: [
      {
        id: "kanban-board",
        name: "KanbanBoard",
        package: "@vault/project",
        tier: "paid",
        description: "Columns with WIP limits, explicit move left/right controls (no drag lib), add-card inputs and deletion.",
        importName: "{ KanbanBoard }",
        usage: "<KanbanBoard columns={columns} onChange={persist} />",
        props: [
          { name: "columns", type: "KanbanColumn[]", description: "id, title, wipLimit, cards." },
          { name: "onChange", type: "(columns) => void", description: "Persist copies." },
        ],
        demo: <BoardDemo />,
      },
      {
        id: "roadmap-timeline",
        name: "RoadmapTimeline",
        package: "@vault/project",
        tier: "paid",
        description: "Year roadmap with a month grid, 'now' marker, status pills and milestone diamonds.",
        importName: "{ RoadmapTimeline }",
        usage: "<RoadmapTimeline items={items} now={7} />",
        props: [
          { name: "items", type: "RoadmapItem[]", description: "name, start/end months, color, status, milestone." },
          { name: "now", type: "number", default: "7", description: "Current month for the marker." },
        ],
        demo: <RoadmapTimeline items={ROADMAP} now={7} />,
      },
      {
        id: "gantt-chart",
        name: "GanttChart",
        package: "@vault/project",
        tier: "paid",
        description: "Week-axis Gantt with group colors, progress fills and milestone markers.",
        importName: "{ GanttChart }",
        usage: "<GanttChart tasks={tasks} weeks={14} />",
        props: [
          { name: "tasks", type: "GanttTask[]", description: "id, name, start/end weeks, progress, group." },
          { name: "weeks", type: "number", default: "16", description: "Axis length." },
        ],
        demo: <GanttChart tasks={GANTT_TASKS} weeks={14} />,
      },
    ],
  },
];

export const FLAT_COMPONENTS = COMPONENT_GROUPS.flatMap((g) => g.items);
export const TOTAL_COMPONENTS = FLAT_COMPONENTS.length - 1; // minus overview

/* ------------------------------- tiny helpers ------------------------------ */

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function TypographyNote() {
  return (
    <div className="hidden items-center gap-1.5 text-sm text-surface-400 sm:flex">
      <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs">5 dots</span>
      motion tokens: <code className="font-mono text-xs">animate-bounce-dot</code>
    </div>
  );
}