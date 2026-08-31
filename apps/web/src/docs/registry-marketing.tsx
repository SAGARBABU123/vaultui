import {
  BarChart,
  DonutChart,
  LineChart,
} from "@vaultui/data-viz";
import { Button } from "@vaultui/ui";
import {
  FaqSection,
  FeatureGrid,
  HeroSection,
  LogosStrip,
  NewsletterSignup,
  StatBand,
  TestimonialGrid,
} from "@vaultui/marketing";
import type { ComponentGroup } from "./types";

/* ============================== chart demos =============================== */

function ChartsDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BarChart
        height={140}
        data={[
          { label: "Mon", value: 42 },
          { label: "Tue", value: 68 },
          { label: "Wed", value: 55 },
          { label: "Thu", value: 81 },
          { label: "Fri", value: 63 },
        ]}
      />
      <LineChart
        height={140}
        labels={["W1", "W2", "W3", "W4", "W5", "W6"]}
        series={[
          {
            label: "Users",
            points: [12, 28, 34, 58, 71, 96],
            color: "var(--color-brand-600)",
          },
          {
            label: "Trials",
            points: [20, 18, 30, 26, 40, 44],
            color: "var(--color-info-500)",
          },
        ]}
      />
      <DonutChart
        size={150}
        centerValue="1.2k"
        centerLabel="total"
        data={[
          { label: "Direct", value: 540 },
          { label: "Search", value: 380 },
          { label: "Referral", value: 210 },
          { label: "Email", value: 74 },
        ]}
      />
      <div className="flex items-center justify-center rounded-2xl border border-surface-200 bg-surface-0 p-4">
        <StatBand
          className="w-full"
          stats={[
            { value: "48", label: "components" },
            { value: "$0", label: "deps" },
            { value: "4", label: "themes" },
          ]}
        />
      </div>
    </div>
  );
}

function MarketingDemo() {
  return (
    <div className="space-y-4">
      <HeroSection
        eyebrow="Vault Marketing Kit"
        title={<>Sell the product, <span className="vault-mk-accent">not the toolkit.</span></>}
        body="Section primitives that read like a designed landing page the moment they're wired in — token-driven, every theme."
        primaryAction={<Button size="lg" className="vault-btn-primary">Get started</Button>}
        secondaryAction={<Button size="lg" className="vault-btn-secondary">Read the docs</Button>}
      />
      <FeatureGrid
        features={[
          { title: "Token-first", body: "One theme file re-brands every section. No per-file CSS." },
          { title: "Zero deps", body: "SVG, React and the Vault tokens — no chart or motion library." },
          { title: "Responsive", body: "Every grid collapses gracefully down to a single column." },
        ]}
      />
      <TestimonialGrid
        testimonials={[
          { quote: "The fastest our landing page has ever come together.", name: "Priya R", role: "Founder, Northstar" },
          { quote: "Swap a theme and the whole page follows. Incredible.", name: "Dev K", role: "Design lead, Orbit" },
        ]}
      />
      <LogosStrip names={["orbit", "northstar", "halcyon", "fieldnote", "kinetic"]} />
      <FaqSection
        items={[
          { question: "Do the sections work without Tailwind?", answer: "Yes — like every Vault component, they are plain token-driven CSS." },
          { question: "Can I restyle accents?", answer: "Accents read --color-brand-*; override anywhere." },
        ]}
      />
      <NewsletterSignup
        note="No spam — one email a month, unsubscribe anytime."
        onSubscribe={() => undefined}
      />
    </div>
  );
}

/* ================================= entries ================================= */

const chartEntries = [
  {
    id: "bar-chart",
    name: "BarChart",
    description: "Zero-dependency bar chart — pure flex bars scaled to the max |value|, token-driven fill, value + axis labels.",
    importName: "{ BarChart }",
    usage: "<BarChart data={[{ label: \"Mon\", value: 42 }]} height={140} />",
    props: [
      { name: "data", type: "{ label, value, color? }[]", description: "Bars; color defaults to the theme brand." },
      { name: "height", type: "number", default: "170", description: "Container height." },
      { name: "showValues", type: "boolean", default: "true", description: "Value labels above bars." },
    ],
  },
  {
    id: "line-chart",
    name: "LineChart",
    description: "Smooth SVG line chart with optional gradient area and per-point hover titles — zero chart libraries.",
    importName: "{ LineChart }",
    usage: "<LineChart series={[{ label, points, color? }]} labels={[\"W1\", …]} />",
    props: [
      { name: "series", type: "{ label, points, color? }[]", description: "One or more lines." },
      { name: "labels", type: "string[]", description: "X-axis labels." },
      { name: "area", type: "boolean", default: "true", description: "Fill under the line." },
    ],
  },
  {
    id: "donut-chart",
    name: "DonutChart",
    description: "Stroke-dasharray donut with hover-expanding slices, optional center metric and a color legend.",
    importName: "{ DonutChart }",
    usage: "<DonutChart data={[{ label, value, color? }]} centerValue=\"1.2k\" />",
    props: [
      { name: "data", type: "{ label, value, color? }[]", description: "Slices; colors auto-resolve from the palette." },
      { name: "size / thickness", type: "number", default: "168 / 24", description: "Ring geometry." },
      { name: "centerValue / centerLabel", type: "string", description: "Center metric." },
    ],
  },
];

const marketingEntries = [
  {
    id: "hero-section",
    name: "HeroSection",
    description: "Centered landing hero — eyebrow, headline, body and CTA slots with an ambient brand glow.",
    importName: "{ HeroSection }",
    usage: "<HeroSection eyebrow=\"Kit\" title={<>Ship it</>} body=\"…\" primaryAction={<Button>Start</Button>} />",
    props: [
      { name: "title", type: "ReactNode", description: "Headline (stick a gradient span inside)." },
      { name: "primaryAction / secondaryAction", type: "ReactNode", description: "CTA slots." },
    ],
  },
  {
    id: "feature-grid",
    name: "FeatureGrid",
    description: "Responsive feature card grid — icon, title, body — auto-fit columns.",
    importName: "{ FeatureGrid }",
    usage: "<FeatureGrid features={[{ icon, title, body }]} />",
    props: [{ name: "features", type: "Feature[]", description: "icon / title / body per card." }],
  },
  {
    id: "stat-band",
    name: "StatBand",
    description: "KPI strip — inset tiles with big brand-gradient values and labels.",
    importName: "{ StatBand }",
    usage: "<StatBand stats={[{ value: \"48\", label: \"components\" }]} />",
    props: [{ name: "stats", type: "{ value, label }[]", description: "Stat tiles." }],
  },
  {
    id: "testimonial-grid",
    name: "Testimonial & Grid",
    description: "Quote cards with avatar initials or photos, single or in a grid.",
    importName: "{ Testimonial, TestimonialGrid }",
    usage: "<TestimonialGrid testimonials={[{ quote, name, role }]} />",
    props: [{ name: "testimonials", type: "TestimonialProps[]", description: "quote / name / role / src." }],
  },
  {
    id: "logos-strip",
    name: "LogosStrip",
    description: "Wordmark strip — gray-weight treatment so the eye reads 'trusted by'.",
    importName: "{ LogosStrip }",
    usage: "<LogosStrip names={[\"orbit\", \"northstar\"]} />",
    props: [{ name: "names", type: "string[]", description: "Company wordmarks." }],
  },
  {
    id: "faq-section",
    name: "FaqSection",
    description: "Accordion-stacked FAQ built on the core Accordion primitive.",
    importName: "{ FaqSection }",
    usage: "<FaqSection items={[{ question, answer }]} />",
    props: [{ name: "items", type: "FaqItem[]", description: "question / answer pairs." }],
  },
  {
    id: "newsletter-signup",
    name: "NewsletterSignup",
    description: "Email capture — input + subscribe button + reassurance note.",
    importName: "{ NewsletterSignup }",
    usage: "<NewsletterSignup onSubscribe={(email) => …} />",
    props: [{ name: "onSubscribe", type: "(email) => void", description: "Fired on submit." }],
  },
];

const fill = (e: any, pkg: string, demo: React.ReactNode) => ({ ...e, package: pkg, tier: "paid" as const, demo });

export const MARKETING_GROUPS: ComponentGroup[] = [
  {
    group: "Data Viz Pro",
    items: chartEntries.map((e) => fill(e, "@vaultui/data-viz", <ChartsDemo />)),
  },
  {
    group: "Marketing Kit",
    items: marketingEntries.map((e) => fill(e, "@vaultui/marketing", <MarketingDemo />)),
  },
];