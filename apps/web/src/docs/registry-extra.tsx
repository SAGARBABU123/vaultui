import { useState } from "react";
import {
  CandlestickChart,
  GeoMap,
  RadarChart,
  SankeyDiagram,
  TimelineSlider,
  TreeMap,
  WaterfallChart,
} from "@gudipudimani/data-viz";
import {
  CheckoutProgressRail,
  GiftCardBuilder,
  SubscriptionManager,
} from "@gudipudimani/commerce";
import {
  CronBuilder,
  JsonPathTester,
  SqlBuilder,
  WebhookSimulator,
} from "@gudipudimani/dev-tools";
import {
  ActivityFeed,
  LiveCursors,
  PresenceList,
  type ActivityEvent,
} from "@gudipudimani/collab";
import { Button } from "@gudipudimani/ui";
import type { ComponentGroup } from "./types";

/* ------------------------------- rail demo ------------------------------- */

function RailDemo() {
  const [current, setCurrent] = useState(0);
  const steps = [
    { id: "info", label: "Information" },
    { id: "pay", label: "Payment" },
    { id: "confirm", label: "Confirm" },
    { id: "done", label: "Complete" },
  ];
  return (
    <div className="space-y-4">
      <CheckoutProgressRail steps={steps} current={current} onStepClick={setCurrent} />
      <div className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          Back
        </Button>
        <Button size="sm" onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))} disabled={current === steps.length - 1}>
          Continue
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------ extra groups ----------------------------- */

export const EXTRA_GROUPS: ComponentGroup[] = [
  {
    group: "Data Viz Pro",
    items: [
      {
        id: "tree-map",
        name: "TreeMap",
        package: "@gudipudimani/data-viz",
        tier: "paid",
        description: "Value-proportional nested rectangles with slice-and-dice layout — no chart library.",
        importName: "{ TreeMap }",
        usage: "<TreeMap items={[{id: \"a\", label: \"Design\", value: 40}]} />",
        props: [
          { name: "items", type: "TreeMapItem[]", description: "id, label, value." },
          { name: "heightClass", type: "string", default: "\"h-[320px]\"", description: "Map height." },
        ],
        demo: (
          <TreeMap
            items={[
              { id: "d", label: "Design", value: 40 },
              { id: "eng", label: "Engineering", value: 32 },
              { id: "pm", label: "Product", value: 18 },
              { id: "qa", label: "QA", value: 12 },
              { id: "ops", label: "Ops", value: 8 },
              { id: "growth", label: "Growth", value: 6 },
            ]}
            heightClass="h-[260px]"
          />
        ),
      },
      {
        id: "waterfall",
        name: "WaterfallChart",
        package: "@gudipudimani/data-viz",
        tier: "paid",
        description: "Cumulative totals with floating deltas, connectors and zero-anchored total bars.",
        importName: "{ WaterfallChart }",
        usage: "<WaterfallChart steps={[{label: \"Start\", value: 10000, type: \"total\"}, {label: \"Growth\", value: 2500}]} />",
        props: [
          { name: "steps", type: "WaterfallStep[]", description: "label, value, type total|delta." },
          { name: "format", type: "(n) => string", description: "Value formatter." },
        ],
        demo: (
          <WaterfallChart
            steps={[
              { label: "MRR", value: 12400, type: "total" },
              { label: "New", value: 3200 },
              { label: "Expansion", value: 1100 },
              { label: "Churn", value: -1400 },
              { label: "End", value: 15300, type: "total" },
            ]}
          />
        ),
      },
      {
        id: "radar",
        name: "RadarChart",
        package: "@gudipudimani/data-viz",
        tier: "paid",
        description: "N-axis spider chart with concentric grid rings and token colors.",
        importName: "{ RadarChart }",
        usage: "<RadarChart axes={[{label: \"Speed\", value: 80}]} />",
        props: [
          { name: "axes", type: "RadarAxis[]", description: "label + value 0–100." },
          { name: "colorClass", type: "string", default: "\"text-brand-600\"", description: "Polygon color." },
        ],
        demo: (
          <div className="flex justify-center">
            <RadarChart
              axes={[
                { label: "Speed", value: 82 },
                { label: "Quality", value: 70 },
                { label: "Docs", value: 55 },
                { label: "A11y", value: 66 },
                { label: "Perf", value: 88 },
                { label: "DX", value: 74 },
              ]}
            />
          </div>
        ),
      },
      {
        id: "sankey",
        name: "SankeyDiagram",
        package: "@gudipudimani/data-viz",
        tier: "paid",
        description: "Two-layer flow diagram — node heights and ribbon widths are value-proportional.",
        importName: "{ SankeyDiagram }",
        usage: "<SankeyDiagram nodes={[...]} links={[{from, to, value}]} />",
        props: [
          { name: "nodes", type: "SankeyNode[]", description: "id, label, value." },
          { name: "links", type: "SankeyLink[]", description: "from/to ids + value." },
        ],
        demo: (
          <SankeyDiagram
            nodes={[
              { id: "leads", label: "Leads", value: 1000 },
              { id: "trial", label: "Trials", value: 620 },
              { id: "paid", label: "Paid", value: 410 },
              { id: "free", label: "Free", value: 210 },
            ]}
            links={[
              { from: "leads", to: "trial", value: 620 },
              { from: "trial", to: "paid", value: 410 },
              { from: "trial", to: "free", value: 180 },
              { from: "leads", to: "free", value: 30 },
            ]}
          />
        ),
      },
      {
        id: "candlestick",
        name: "CandlestickChart",
        package: "@gudipudimani/data-viz",
        tier: "paid",
        description: "OHLC candles with wicks, last-price line and date labels.",
        importName: "{ CandlestickChart }",
        usage: "<CandlestickChart data={[{label: \"Mon\", open: 10, high: 11, low: 9, close: 10.5}]} />",
        props: [
          { name: "data", type: "Candlestick[]", description: "label, open, high, low, close." },
        ],
        demo: (
          <CandlestickChart
            data={[
              { label: "Mon", open: 100, high: 104, low: 98, close: 103 },
              { label: "Tue", open: 103, high: 107, low: 101, close: 102 },
              { label: "Wed", open: 102, high: 109, low: 102, close: 108.5 },
              { label: "Thu", open: 108.5, high: 110, low: 105, close: 106 },
              { label: "Fri", open: 106, high: 111.5, low: 105.5, close: 110.5 },
            ]}
          />
        ),
      },
      {
        id: "timeline-slider",
        name: "TimelineSlider",
        package: "@gudipudimani/data-viz",
        tier: "paid",
        description: "Scrub through series data with play/pause, click-to-seek and keyboard support.",
        importName: "{ TimelineSlider }",
        usage: "<TimelineSlider points={[{time: \"09:00\", value: 12}]} intervalMs={900} />",
        props: [
          { name: "points", type: "TimelinePoint[]", description: "time + value." },
          { name: "intervalMs", type: "number", default: "900", description: "Play speed." },
          { name: "format", type: "(n) => string", description: "Value formatter." },
        ],
        demo: (
          <TimelineSlider
            points={[
              { time: "00:00", value: 0 },
              { time: "04:00", value: 4 },
              { time: "08:00", value: 9 },
              { time: "12:00", value: 7 },
              { time: "16:00", value: 14 },
              { time: "20:00", value: 11 },
              { time: "23:59", value: 17 },
            ]}
            format={(n) => `${n.toFixed(1)}k`}
          />
        ),
      },
      {
        id: "geo-map",
        name: "GeoMap",
        package: "@gudipudimani/data-viz",
        tier: "paid",
        description: "Stylized dot map — continent blobs + value-scaled markers, zero geo libraries.",
        importName: "{ GeoMap }",
        usage: "<GeoMap regions={[{id, label, value, x, y}]} />",
        props: [
          { name: "regions", type: "GeoRegion[]", description: "0–100 x/y coordinates." },
          { name: "landmasses", type: "blobs[]", description: "Override continent shapes." },
        ],
        demo: (
          <GeoMap
            regions={[
              { id: "us", label: "US", value: 92, x: 24, y: 30 },
              { id: "br", label: "BR", value: 34, x: 48, y: 62 },
              { id: "de", label: "DE", value: 61, x: 62, y: 28 },
              { id: "in", label: "IN", value: 77, x: 78, y: 42 },
              { id: "jp", label: "JP", value: 45, x: 88, y: 34 },
              { id: "au", label: "AU", value: 28, x: 82, y: 65 },
            ]}
          />
        ),
      },
    ],
  },
  {
    group: "Commerce Kit",
    items: [
      {
        id: "checkout-rail",
        name: "CheckoutProgressRail",
        package: "@gudipudimani/commerce",
        tier: "paid",
        description: "Stepped checkout progress with connectors, animated fill and clickable completed steps.",
        importName: "{ CheckoutProgressRail }",
        usage: "<CheckoutProgressRail steps={steps} current={2} onStepClick={setStep} />",
        props: [
          { name: "steps", type: "CheckoutStep[]", description: "id, label, hint." },
          { name: "current", type: "number", description: "Active step index." },
          { name: "onStepClick", type: "(i) => void", description: "Jump to completed steps." },
        ],
        demo: <RailDemo />,
      },
      {
        id: "subscription-manager",
        name: "SubscriptionManager",
        package: "@gudipudimani/commerce",
        tier: "paid",
        description: "Plan card with lifecycle: change plan, pause/resume, cancel with confirm steps.",
        importName: "{ SubscriptionManager }",
        usage: "<SubscriptionManager subscription={{name: \"Pro\", price: \"$49\", interval: \"monthly\", nextBillingDate: \"Mar 1\"}} />",
        props: [
          { name: "subscription", type: "SubscriptionInfo", description: "Plan details." },
          { name: "onAction", type: "(action, status) => void", description: "Lifecycle events." },
        ],
        demo: (
          <SubscriptionManager
            subscription={{ name: "Pro", price: "$49", interval: "monthly", nextBillingDate: "Mar 1", seats: 5 }}
          />
        ),
      },
      {
        id: "gift-card",
        name: "GiftCardBuilder",
        package: "@gudipudimani/commerce",
        tier: "paid",
        description: "Live-updating gift card editor: amounts, themes, message, recipient.",
        importName: "{ GiftCardBuilder }",
        usage: "<GiftCardBuilder onAddToCart={(cfg) => addToCart(cfg)} />",
        props: [
          { name: "onAddToCart", type: "(config) => void", description: "Recipient config." },
          { name: "currency", type: "string", default: "\"$\"", description: "Currency symbol." },
        ],
        demo: <GiftCardBuilder />,
      },
    ],
  },
  {
    group: "Dev Tools Kit",
    items: [
      {
        id: "sql-builder",
        name: "SqlBuilder",
        package: "@gudipudimani/dev-tools",
        tier: "paid",
        description: "Build SELECT queries visually — columns, WHERE clauses with operators, LIMIT; SQL compiles live.",
        importName: "{ SqlBuilder }",
        usage: "<SqlBuilder columns={[\"id\", \"name\", \"email\"]} table=\"users\" />",
        props: [
          { name: "columns", type: "string[]", description: "Schema columns." },
          { name: "table", type: "string", default: "\"users\"", description: "From clause." },
          { name: "onQueryChange", type: "(sql) => void", description: "Live SQL output." },
        ],
        demo: (
          <SqlBuilder
            columns={["id", "name", "email", "plan", "created_at"]}
            table="users"
          />
        ),
      },
      {
        id: "cron-builder",
        name: "CronBuilder",
        package: "@gudipudimani/dev-tools",
        tier: "paid",
        description: "Visual 5-field cron editor with presets and next-run preview computed in-browser.",
        importName: "{ CronBuilder }",
        usage: "<CronBuilder defaultValue=\"*/15 * * * *\" />",
        props: [
          { name: "defaultValue", type: "string", default: "\"*/15 * * * *\"", description: "Initial expression." },
          { name: "onChange", type: "(expr) => void", description: "Expression change." },
        ],
        demo: <CronBuilder />,
      },
      {
        id: "json-path",
        name: "JsonPathTester",
        package: "@gudipudimani/dev-tools",
        tier: "paid",
        description: "Evaluate $.a.b[0]-style paths against JSON with type badge, history chips and inline errors.",
        importName: "{ JsonPathTester }",
        usage: "<JsonPathTester defaultPath=\"$.user.projects[0].name\" />",
        props: [
          { name: "defaultJson", type: "string", description: "Body to test against." },
          { name: "defaultPath", type: "string", description: "Initial path." },
        ],
        demo: <JsonPathTester />,
      },
      {
        id: "webhook-sim",
        name: "WebhookSimulator",
        package: "@gudipudimani/dev-tools",
        tier: "paid",
        description: "Send preset events with status/latency/request-id logging and retries.",
        importName: "{ WebhookSimulator }",
        usage: "<WebhookSimulator endpoint=\"https://my.app/hooks\" />",
        props: [
          { name: "presets", type: "WebhookPreset[]", description: "Event payloads." },
          { name: "endpoint", type: "string", description: "Default URL." },
        ],
        demo: <WebhookSimulator />,
      },
    ],
  },
  {
    group: "Collab Kit",
    items: [
      {
        id: "presence-list",
        name: "PresenceList",
        package: "@gudipudimani/collab",
        tier: "paid",
        description: "Who's here — avatar stack with overflow count or full rows with activity and status dots.",
        importName: "{ PresenceList }",
        usage: "<PresenceList users={[{id, name, color, status}]} />",
        props: [
          { name: "users", type: "PresenceUser[]", description: "name, color class, status, activity." },
          { name: "mode", type: "\"auto\" | \"stack\" | \"list\"", default: "\"auto\"", description: "Default view." },
        ],
        demo: (
          <PresenceList
            users={[
              { id: "u1", name: "Sagar Babu", color: "bg-brand-600", status: "online", activity: "Editing Button.tsx" },
              { id: "u2", name: "Priya R", color: "bg-success-600", status: "online", activity: "In the chat demo" },
              { id: "u3", name: "Dev K", color: "bg-info-600", status: "idle", activity: "Away 5m" },
              { id: "u4", name: "Ana M", color: "bg-warning-600", status: "online", activity: "Reviewing props" },
              { id: "u5", name: "Leo T", color: "bg-danger-600", status: "offline" },
            ]}
          />
        ),
      },
      {
        id: "live-cursors",
        name: "LiveCursors",
        package: "@gudipudimani/collab",
        tier: "paid",
        description: "Collaborative cursor overlay with name tags — feed 0–100 % positions; autoPilot drifts for demos.",
        importName: "{ LiveCursors }",
        usage: "<LiveCursors cursors={[{id, name, color, x, y}]} />",
        props: [
          { name: "cursors", type: "LiveCursor[]", description: "id, name, color, x/y %." },
          { name: "autoPilot", type: "boolean", default: "false", description: "Self-animating demo mode." },
        ],
        demo: (
          <LiveCursors
            autoPilot
            cursors={[
              { id: "c1", name: "Sagar", color: "#4f46e5", x: 20, y: 30 },
              { id: "c2", name: "Priya", color: "#16a34a", x: 55, y: 60 },
              { id: "c3", name: "Ana", color: "#ea580c", x: 75, y: 25 },
            ]}
          />
        ),
      },
      {
        id: "activity-feed",
        name: "ActivityFeed",
        package: "@gudipudimani/collab",
        tier: "paid",
        description: "Chronological activity feed with type icons, unread counts, filters and mark-all-read.",
        importName: "{ ActivityFeed }",
        usage: "<ActivityFeed events={[{id, actor, type, action, target, time}]} />",
        props: [
          { name: "events", type: "ActivityEvent[]", description: "create/edit/comment/delete + unread." },
        ],
        demo: (
          <ActivityFeed
            events={[
              { id: "e1", actor: "Priya", type: "edit", action: "", target: "ChatCanvas.tsx", time: "2m", unread: true },
              { id: "e2", actor: "Sagar", type: "comment", action: "", target: "CronBuilder", time: "9m", unread: true },
              { id: "e3", actor: "Ana", type: "create", action: "", target: "SankeyDiagram", time: "18m" },
              { id: "e4", actor: "Leo", type: "delete", action: "", target: "old-welcome-banner", time: "1h" },
              { id: "e5", actor: "Dev", type: "comment", action: "", target: "GeoMap blobs", time: "2h" },
              { id: "e6", actor: "Sagar", type: "create", action: "", target: "Collab Kit", time: "4h" },
            ]}
          />
        ),
      },
    ],
  },
];

/* Re-export activity type for the app shell */
export type { ActivityEvent };