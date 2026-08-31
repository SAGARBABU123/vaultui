import { Button } from "@vaultui/ui";
import {
  BulletChart,
  FunnelChart,
  GaugeChart,
  ScatterChart,
} from "@vaultui/data-viz";
import {
  CouponPicker,
  Invoice,
  OrderTracking,
  ReviewRating,
  WishlistButton,
} from "@vaultui/commerce";
import { BurndownChart, DependencyGraph, OkrTree } from "@vaultui/project";
import { CommentsThread, Mentions, ReactionPicker } from "@vaultui/collab";
import { EnvVarsTable, JwtInspector, PerformanceMonitor } from "@vaultui/dev-tools";
import { PromptDiff, RagSearch, TokenCostMeter } from "@vaultui/ai-chat";
import {
  ComparisonSection,
  CtaBand,
  IntegrationsGrid,
  PricingSection,
} from "@vaultui/marketing";
import type { ComponentEntry, ComponentGroup } from "./types";

/* ============================== chart demos =============================== */

function ChartsDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-3">
        <ScatterChart
          points={[
            { x: 4, y: 22, label: "a" }, { x: 9, y: 48, label: "b" }, { x: 14, y: 45, label: "c" },
            { x: 19, y: 62, label: "d" }, { x: 24, y: 78, label: "e" }, { x: 33, y: 95, label: "f" },
            { x: 39, y: 90, label: "g" }, { x: 44, y: 110, label: "h" },
          ]}
        />
      </div>
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-3">
        <FunnelChart
          stages={[
            { label: "Visitors", value: 5200 },
            { label: "Trials", value: 480 },
            { label: "Paid", value: 96 },
          ]}
        />
      </div>
      <GaugeChart value={74} label="goal completion" />
      <div className="flex items-center justify-center">
        <BulletChart label="Revenue vs plan" value={82} target={100} max={120} />
      </div>
    </div>
  );
}

function CommerceDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <OrderTracking
        steps={[
          { label: "Order placed", date: "Aug 28" },
          { label: "Shipped", date: "Aug 29", done: true },
          { label: "In transit" },
          { label: "Delivered" },
        ]}
      />
      <Invoice
        number="INV-1042"
        issued="Aug 28, 2025"
        client={<p>Acme Inc. · ops@acme.dev</p>}
        lines={[
          { description: "Vault UI premium license", qty: 1, unitPrice: 49 },
          { description: "Team seats", qty: 4, unitPrice: 12 },
        ]}
      />
      <div className="space-y-4">
        <ReviewRating value={4} max={5} />
        <div className="flex gap-2">
          <WishlistButton />
          <WishlistButton active />
        </div>
      </div>
      <CouponPicker
        coupons={[
          { code: "VAULT20", label: "20% off", discount: "20% off" },
          { code: "EARLY", label: "Early bird", discount: "30% off" },
        ]}
      />
    </div>
  );
}

function ProjectDemo() {
  return (
    <div className="space-y-4">
      <BurndownChart labels={["S1", "S2", "S3", "S4", "S5", "S6"]} remaining={[42, 38, 31, 22, 14, 6]} />
      <DependencyGraph
        nodes={[
          { id: "a", label: "UI", layer: 0 },
          { id: "b", label: "Auth", layer: 0 },
          { id: "c", label: "API", layer: 1 },
          { id: "d", label: "DB", layer: 2 },
        ]}
        edges={[
          { from: "a", to: "c" },
          { from: "b", to: "c" },
          { from: "c", to: "d" },
        ]}
      />
      <OkrTree
        objectives={[
          {
            objective: "Ship the core kit",
            keyResults: [
              { label: "14 primitives live", progress: 100 },
              { label: "Docs coverage", progress: 80 },
              { label: "npm installs", progress: 45 },
            ],
          },
        ]}
      />
    </div>
  );
}

function CollabDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CommentsThread
        comments={[
          { author: "Priya R", body: "Shipping this today — the layout feels right.", time: "2h" },
          { author: "Dev K", body: "Nice! Token-driven, so it re-skins everywhere.", time: "1h" },
        ]}
      />
      <div className="space-y-4">
        <ReactionPicker
          reactions={[
            { emoji: "🔥", label: "fire", count: 12 },
            { emoji: "👏", label: "clap", count: 8 },
            { emoji: "🚀", label: "ship", count: 5 },
          ]}
        />
        <Mentions
          people={[
            { id: "p1", name: "Priya Rana" },
            { id: "p2", name: "Dev Khanna" },
            { id: "p3", name: "Leo Tao" },
            { id: "p4", name: "Ana Marques" },
          ]}
          placeholder="@-mention a teammate…"
        />
      </div>
    </div>
  );
}

function DevDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PerformanceMonitor />
      <JwtInspector />
      <div className="lg:col-span-2">
        <EnvVarsTable
          vars={[
            { key: "NEXT_PUBLIC_API", value: "https://api.acme.dev", secret: false },
            { key: "SUPABASE_SERVICE_KEY", value: "eyJ…", secret: true },
            { key: "STRIPE_WEBHOOK_SECRET", value: "whsec_…", secret: true },
          ]}
        />
      </div>
    </div>
  );
}

function AiDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TokenCostMeter />
      <RagSearch
        results={[
          { title: "Streaming markdown", snippet: "Set streaming on the assistant message…", score: 0.98, source: "docs/chat-canvas" },
          { title: "Tool calls", snippet: "Tool calls collapse into inspector cards…", score: 0.91, source: "docs/tool-call-inspector" },
          { title: "Auto-scroll", snippet: "Pinned to the latest message while streaming…", score: 0.87, source: "docs/chat-input" },
        ]}
      />
      <div className="lg:col-span-2">
        <PromptDiff
          before={"You are a helpful assistant.\nAnswer concisely.\nUse markdown."}
          after={"You are a senior product designer.\nAnswer in 5 bullets.\nOnly use markdown for lists.\nQuote sources."}
        />
      </div>
    </div>
  );
}

function MarketingDemo() {
  return (
    <div className="space-y-4">
      <PricingSection
        plans={[
          { name: "Starter", price: "$0", period: "forever", features: ["Core primitives", "MIT license", "Community support"] },
          {
            name: "Pro",
            price: "$49",
            period: "one-time",
            highlighted: true,
            description: "All kits, one license.",
            features: ["7 kits · 100+ components", "Commercial license", "Future updates"],
          },
          { name: "Teams", price: "$129", period: "one-time", features: ["Pro + collab kit", "Seat-based", "Priority support"] },
        ]}
      />
      <CtaBand
        title={<>Ship something that <span className="text-gradient-brand">feels inevitable.</span></>}
        body="One set of decisions, applied consistently."
        primaryAction={<Button className="vault-btn-primary">Get started</Button>}
        secondaryAction={<Button className="vault-btn-secondary">Read the docs</Button>}
      />
      <IntegrationsGrid
        integrations={[
          { name: "Supabase", description: "Auth + database, the Vault way.", tag: "auth" },
          { name: "Stripe", description: "Billing with the Commerce kit.", tag: "billing" },
          { name: "Vercel", description: "Deploy the starter app in one click." },
        ]}
      />
      <ComparisonSection
        features={["Theme re-skin", "Zero deps", "Source included", "CLI installer"]}
        columns={[
          { label: "Vault UI", highlighted: true, rows: [true, true, true, true] },
          { label: "Free core", rows: [true, true, true, "n/a"] },
          { label: "DIY", rows: [false, true, true, false] },
        ]}
      />
    </div>
  );
}

/* ================================= entries ================================= */

const fill = (e: Omit<ComponentEntry, "package" | "tier" | "demo">, pkg: string, demo: React.ReactNode): ComponentEntry => ({
  ...e,
  package: pkg,
  tier: "paid",
  demo,
});

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const shared = (
  name: string,
  desc: string,
  imp: string,
  usg: string,
  props: ComponentEntry["props"],
): Omit<ComponentEntry, "package" | "tier" | "demo"> => ({
  id: slug(name),
  name,
  description: desc,
  importName: imp,
  usage: usg,
  props,
});

export const OPTION_A_GROUPS: ComponentGroup[] = [
  {
    group: "Data Viz Pro",
    items: [
      fill(shared("ScatterChart", "Zero-dependency scatter plot with axis bounds and hover titles.", "{ ScatterChart }", "<ScatterChart points={[{ x, y }]} />", []), "@vaultui/data-viz", <ChartsDemo />),
      fill(shared("FunnelChart", "Conversion funnel — descending centered bars with stage → stage percentages.", "{ FunnelChart }", "<FunnelChart stages={[{ label, value }]} />", []), "@vaultui/data-viz", <ChartsDemo />),
      fill(shared("GaugeChart", "Semi-circular gauge with token fill, center value and label.", "{ GaugeChart }", "<GaugeChart value={74} label=\"progress\" />", []), "@vaultui/data-viz", <ChartsDemo />),
      fill(shared("BulletChart", "Bullet graph — quantile band, measure bar and target marker.", "{ BulletChart }", "<BulletChart value={82} target={100} max={120} />", []), "@vaultui/data-viz", <ChartsDemo />),
    ],
  },
  {
    group: "Commerce Kit",
    items: [
      fill(shared("OrderTracking", "Vertical order timeline — done/active steps with dates.", "{ OrderTracking }", "<OrderTracking steps={[{ label, done }]} />", []), "@vaultui/commerce", <CommerceDemo />),
      fill(shared("Invoice", "B2B invoice document — line items and totals.", "{ Invoice }", "<Invoice number=\"INV-1\" lines={[{ description, qty, unitPrice }]} />", []), "@vaultui/commerce", <CommerceDemo />),
      fill(shared("ReviewRating", "Interactive or static star rating with hover preview.", "{ ReviewRating }", "<ReviewRating value={4} onChange={set} />", []), "@vaultui/commerce", <CommerceDemo />),
      fill(shared("WishlistButton", "Heart toggle — controlled or uncontrolled.", "{ WishlistButton }", "<WishlistButton active onToggle={fn} />", []), "@vaultui/commerce", <CommerceDemo />),
      fill(shared("CouponPicker", "Apply a coupon — input, validation, applied state and suggestions.", "{ CouponPicker }", "<CouponPicker coupons={[{ code, discount }]} />", []), "@vaultui/commerce", <CommerceDemo />),
    ],
  },
  {
    group: "Project Kit",
    items: [
      fill(shared("BurndownChart", "Sprint burndown — ideal line vs actual remaining points.", "{ BurndownChart }", "<BurndownChart remaining={[42, 38]} labels={[\"S1\"]} />", []), "@vaultui/project", <ProjectDemo />),
      fill(shared("DependencyGraph", "Layered dependency diagram with bezier edges.", "{ DependencyGraph }", "<DependencyGraph nodes={[{ id, label, layer }]} edges={[{ from, to }]} />", []), "@vaultui/project", <ProjectDemo />),
      fill(shared("OkrTree", "Objective + key-result cards with progress bars and rollup.", "{ OkrTree }", "<OkrTree objectives={[{ objective, keyResults }]} />", []), "@vaultui/project", <ProjectDemo />),
    ],
  },
  {
    group: "Collab Kit",
    items: [
      fill(shared("CommentsThread", "Threaded comments with avatars, times and inline posting.", "{ CommentsThread }", "<CommentsThread comments={[{ author, body }]} />", []), "@vaultui/collab", <CollabDemo />),
      fill(shared("ReactionPicker", "Emoji reaction pills with counts and active state.", "{ ReactionPicker }", "<ReactionPicker reactions={[{ emoji, label, count }]} />", []), "@vaultui/collab", <CollabDemo />),
      fill(shared("Mentions", "At-mention input with filtered people popup.", "{ Mentions }", "<Mentions people={[{ id, name }]} />", []), "@vaultui/collab", <CollabDemo />),
    ],
  },
  {
    group: "Dev Tools Kit",
    items: [
      fill(shared("PerformanceMonitor", "Live FPS/latency charts sampled from the animation frame loop.", "{ PerformanceMonitor }", "<PerformanceMonitor interval={500} />", []), "@vaultui/dev-tools", <DevDemo />),
      fill(shared("EnvVarsTable", "Environment variables table with secret masking.", "{ EnvVarsTable }", "<EnvVarsTable vars={[{ key, value, secret }]} />", []), "@vaultui/dev-tools", <DevDemo />),
      fill(shared("JwtInspector", "Decode a JWT — header and payload JSON, signature shown.", "{ JwtInspector }", "<JwtInspector token=\"eyJ…\" />", []), "@vaultui/dev-tools", <DevDemo />),
    ],
  },
  {
    group: "AI Agent Kit",
    items: [
      fill(shared("TokenCostMeter", "Live input/output token + price estimate for a request.", "{ TokenCostMeter }", "<TokenCostMeter inputTokens={2400} />", []), "@vaultui/ai-chat", <AiDemo />),
      fill(shared("RagSearch", "Search-query box with scored result cards.", "{ RagSearch }", "<RagSearch results={[{ title, snippet, score }]} />", []), "@vaultui/ai-chat", <AiDemo />),
      fill(shared("PromptDiff", "Line-level diff between two prompts — added/removed rows.", "{ PromptDiff }", "<PromptDiff before={a} after={b} />", []), "@vaultui/ai-chat", <AiDemo />),
    ],
  },
  {
    group: "Marketing Kit",
    items: [
      fill(shared("PricingSection", "Pricing plans grid with highlighted best value and CTA slots.", "{ PricingSection }", "<PricingSection plans={[{ name, price, features }]} />", []), "@vaultui/marketing", <MarketingDemo />),
      fill(shared("CtaBand", "Full-width call-to-action band with a brand-gradient backdrop.", "{ CtaBand }", "<CtaBand title=\"…\" primaryAction={<Button>…</Button>} />", []), "@vaultui/marketing", <MarketingDemo />),
      fill(shared("IntegrationsGrid", "Integration tiles with color-coded monograms and tags.", "{ IntegrationsGrid }", "<IntegrationsGrid integrations={[{ name, description }]} />", []), "@vaultui/marketing", <MarketingDemo />),
      fill(shared("ComparisonSection", "Feature-by-feature comparison table with check/missing marks.", "{ ComparisonSection }", "<ComparisonSection features={[]} columns={[{ label, rows }]} />", []), "@vaultui/marketing", <MarketingDemo />),
    ],
  },
];