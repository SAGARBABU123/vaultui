import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "@vaultui/ui";
import { Sparkline } from "@vaultui/data-viz";
import { cn } from "@vaultui/utils";
import { ArrowRight, BarChart3, Bot, Check, Copy, Download, Kanban, Lock, Megaphone, Package, ShoppingCart, Terminal, UserPlus, Users, Wrench } from "lucide-react";
import { AuthControl } from "../auth/AuthControl";
// Registry-dependent helpers (downloadKit) are lazy-imported at call time —
// statically importing them would pull the whole kit registry into this chunk.
import { COMPONENT_COUNT, DASHBOARD_COUNT, PACKAGE_MANAGERS, type PackageManagerId } from "../projects/counts";
import { VaultLogo } from "../brand/VaultLogo";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import { ParticleField } from "./ParticleField";
import { ClickSpark } from "./ClickSpark";

/* ============================== static data ================================ */
/* Mirrors packages/tokens/src/tokens.css — the source of truth for the lab.   */

const REPO_URL = "https://github.com/SAGARBABU123/vaultui";

const BRAND_SCALE = [
  { name: "50", hex: "#eef0ff" },
  { name: "100", hex: "#e2e6ff" },
  { name: "200", hex: "#c9d0ff" },
  { name: "300", hex: "#a7b2fb" },
  { name: "400", hex: "#8b96f7" },
  { name: "500", hex: "#6f7bf2" },
  { name: "600", hex: "#5b66e8" },
  { name: "700", hex: "#4a53c9" },
  { name: "800", hex: "#3c44a5" },
  { name: "900", hex: "#333a86" },
  { name: "950", hex: "#242a5e" },
] as const;

const SURFACE_SCALE = [
  { name: "0", hex: "#ffffff" },
  { name: "50", hex: "#faf9f8" },
  { name: "100", hex: "#f4f3f1" },
  { name: "200", hex: "#e8e6e1" },
  { name: "300", hex: "#ddd9d2" },
  { name: "400", hex: "#b0aba0" },
  { name: "500", hex: "#a49f93" },
  { name: "600", hex: "#7a7465" },
  { name: "700", hex: "#5f594d" },
  { name: "800", hex: "#48423a" },
  { name: "900", hex: "#34312b" },
  { name: "950", hex: "#211f1a" },
] as const;

const SEMANTIC_COLORS = [
  { name: "success", hex: "#2fbf7f" },
  { name: "warning", hex: "#e8a93d" },
  { name: "danger", hex: "#e56b7a" },
  { name: "info", hex: "#5aa7e2" },
] as const;

const RADII = [
  { token: "xs", px: "4px" },
  { token: "sm", px: "6px" },
  { token: "md", px: "8px" },
  { token: "lg", px: "12px" },
  { token: "xl", px: "16px" },
  { token: "2xl", px: "20px" },
] as const;

/** Elevation CTA copy per theme — the default caption only describes the guideline tiering. */
const ELEVATION_CAPTIONS: Record<string, string> = {
  neumorphic: "warm paper · light-from-above elevation",
  glassmorphism: "glassmorphism · soft drop glows",
  "dimensional-layering": "dimensional · 4-level elevation stack",
  "vintage-retro-film": "vintage · warm sepia shadows",
};

/** Read a live --color-* token from the active theme; "" when unavailable. */
function readTokenHex(token: string): string {
  if (typeof window === "undefined") return "";
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return v && !v.startsWith("--") ? v : "";
}

/** Pick a readable label colour for a swatch (hex or rgb/rgba) on any theme. */
function swatchText(bg: string): string {
  let r: number, g: number, b: number;
  const hex = bg.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    r = (n >> 16) & 255;
    g = (n >> 8) & 255;
    b = n & 255;
  } else {
    const m = bg.match(/(\d+(?:\.\d+)?)/g)?.map(Number) ?? [];
    if (m.length < 3) return "#3a4254";
    r = Math.round(m[0]!);
    g = Math.round(m[1]!);
    b = Math.round(m[2]!);
  }
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.5 ? "#3a4254" : "#f2f5fa";
}

const KITS = [
  {
    icon: Bot,
    accentBorder: "border-t-brand-300",
    name: "AI Agent Kit",
    pkg: "@vaultui/ai-chat",
    count: 14,
    blurb: "ChatCanvas, streaming tokens, tool-call inspectors, RAG search, token cost meters — the interface for intelligence, finished.",
    accent: "bg-brand-100 text-brand-700",
  },
  {
    icon: BarChart3,
    accentBorder: "border-t-success-300",
    name: "Data Viz Pro",
    pkg: "@vaultui/data-viz",
    count: 19,
    blurb: "KPI cards, bar/line/donut, scatter, funnel, gauge, Sankey, candlesticks, heatmaps — real charting with zero chart libraries.",
    accent: "bg-success-500/15 text-success-500",
  },
  {
    icon: ShoppingCart,
    accentBorder: "border-t-warning-300",
    name: "Commerce Kit",
    pkg: "@vaultui/commerce",
    count: 13,
    blurb: "Pricing tables, carts, checkout rails, invoices, order tracking, coupons — the money moments, de-risked.",
    accent: "bg-warning-500/15 text-warning-500",
  },
  {
    icon: Wrench,
    accentBorder: "border-t-surface-300",
    name: "Dev Tools Kit",
    pkg: "@vaultui/dev-tools",
    count: 11,
    blurb: "Log streams, diffs, API playgrounds, JWT inspectors, performance monitors — developer surfaces, dignified.",
    accent: "bg-surface-200 text-surface-700",
  },
  {
    icon: Kanban,
    accentBorder: "border-t-info-300",
    name: "Project Mgmt Kit",
    pkg: "@vaultui/project",
    count: 6,
    blurb: "Kanban, roadmaps, Gantt, burndowns, dependency graphs, OKRs — planning made legible instead of abstract.",
    accent: "bg-info-500/15 text-info-500",
  },
  {
    icon: Users,
    accentBorder: "border-t-danger-300",
    name: "Collab Kit",
    pkg: "@vaultui/collab",
    count: 6,
    blurb: "Presence, live cursors, comments, reactions, mentions — the room, rendered to the pixel.",
    accent: "bg-danger-500/15 text-danger-500",
  },
  {
    icon: Megaphone,
    accentBorder: "border-t-brand-300",
    name: "Marketing Kit",
    pkg: "@vaultui/marketing",
    count: 11,
    blurb: "Heroes, pricing, comparisons, integrations, CTA bands, stats, testimonials — landing pages that read as designed, in minutes.",
    accent: "bg-brand-100 text-brand-700",
  },
] as const;

/** Registry totals (latin counts, kept in sync via scripts/registry-count.mjs —
 *  importing the registries here would bundle the whole kit into the main chunk). */
const TOTAL_COMPONENTS = COMPONENT_COUNT;
const FREE_TIER = 24;
const TOTAL_KITS = 7; // DASHBOARD_COUNT imported from ../projects/counts

/* ================================ page ==================================== */

export function LandingPage({ onBrowse }: { onBrowse: () => void }) {
  return (
    <ClickSpark
      sparkColor="var(--color-brand-400)"
      sparkCount={10}
      sparkRadius={18}
      sparkSize={10}
      duration={420}
    >
      <div className="min-h-screen scroll-smooth text-surface-900">
        <Nav />
        <main id="main-content">
          <Hero onBrowse={onBrowse} />
          <Philosophy />
          <SystemLab />
          <KitsSection onBrowse={onBrowse} />
          <Licensing />
          <InstallSection onBrowse={onBrowse} />
          <FinalCta onBrowse={onBrowse} />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

/* ---------------------------------- nav ----------------------------------- */

const SECTION_IDS = ["system", "kits", "pricing", "install"] as const;

/** Track which anchored section is in view for the sticky nav's active state. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const onScroll = () => {
      // Sticky header is h-16 (64px) — anything whose top crosses ~120px is "in view".
      const threshold = 120;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

function Nav() {
  const active = useActiveSection(SECTION_IDS);
  return (
    <header className="sticky top-0 z-30 border-b border-surface-200/80 bg-surface-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <VaultLogo size={32} />
          <span className="text-[15px]">
            Vault&nbsp;UI
            <span className="ml-2 hidden rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-700 sm:inline-block">
              soft ui · v0.1.1
            </span>
          </span>
        </a>

        <nav aria-label="Landing" className="hidden items-center gap-1 md:flex">
          {[
            { href: "#system", label: "Design system" },
            { href: "#kits", label: "Kits" },
            { href: "#pricing", label: "Licensing" },
            { href: "#install", label: "Install" },
          ].map((l) => {
            const id = l.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
                )}
              >
                {l.label}
              </a>
            );
          })}
          <Link
            to="/lab"
            className="rounded-lg px-3 py-2 text-sm text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
          >
            Rebrand lab
          </Link>
          <Link
            to="/composer"
            className="rounded-lg px-3 py-2 text-sm text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
          >
            Composer
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Only auth lives on the public landing — themes & GitHub are app-side (post sign-in) */}
          <AuthControl />
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- hero ---------------------------------- */

function Hero({ onBrowse }: { onBrowse: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const goSignIn = () => navigate("/sign-in", { state: { from: "/docs" } });
  const goSignUp = () => navigate("/sign-up", { state: { from: "/docs" } });

  const handleDownload = async () => {
    if (!isSignedIn) {
      navigate("/sign-in", { state: { from: "/docs" } });
      return;
    }
    setDownloading(true);
    try {
      // Lazy — downloadKit statically pulls the registry (whole kit): load
      // only when the user actually clicks “Download kit”.
      await import("../docs/downloadKit").then((m) => m.downloadKit());
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="top" className="relative overflow-hidden">
      {/* signature texture: faint dot grid, masked toward the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage: "radial-gradient(rgb(99 116 160 / 0.16) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* indigo node network — reveals around the cursor */}
      <ParticleField className="absolute inset-0" />
      {/* ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="brand" size="sm" dot>
              {TOTAL_COMPONENTS} components · {TOTAL_KITS} kits · {DASHBOARD_COUNT} dashboards
            </Badge>
            <Badge variant="neutral" size="sm">one token engine</Badge>
          </div>

          {/* the quote */}
          <figure className="mt-10">
            <blockquote className="text-lg font-light italic leading-relaxed text-surface-600 sm:text-xl">
              <span aria-hidden="true" className="select-none text-brand-400">“</span>
              The details are not the details. They make the design.
              <span aria-hidden="true" className="select-none text-brand-400">”</span>
            </blockquote>
            <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-surface-400">
              — Charles Eames
            </figcaption>
          </figure>

          {/* the slogan */}
          <h1 className="mt-8 text-4xl font-extrabold leading-[1.08] tracking-tight text-surface-900 sm:text-6xl">
            The interface is the product.
            <br />
            <span className="text-gradient-brand">Craft it accordingly.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-surface-500 sm:text-lg">
            Vault UI is a premium React + Tailwind component line — {TOTAL_COMPONENTS} components
            across {TOTAL_KITS} kits, unified by one token engine. Dependency-light by design, so
            the details stay consistent while your brand stays yours.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isSignedIn ? (
              <>
                <Button
                  size="lg"
                  onClick={onBrowse}
                  trailingIcon={<ArrowRight className="size-5" />}
                  fullWidth
                  className="sm:w-auto"
                >
                  Browse {TOTAL_COMPONENTS} components
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  className="sm:w-auto"
                  onClick={handleDownload}
                  disabled={downloading}
                  leadingIcon={downloading ? <Package className="size-5 animate-pulse" /> : <Download className="size-5" />}
                >
                  {downloading ? "Packing zip…" : "Download the kit"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={goSignIn}
                  leadingIcon={<Lock className="size-5" />}
                  trailingIcon={<ArrowRight className="size-5" />}
                  fullWidth
                  className="sm:w-auto"
                >
                  Sign in to browse
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  className="sm:w-auto"
                  onClick={goSignUp}
                  leadingIcon={<UserPlus className="size-5" />}
                >
                  Create account
                </Button>
              </>
            )}
          </div>
        </div>

        {/* specimen — the design system, alive */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-brand-200/20 blur-2xl" />
          <Card padding="none" shadow="raised" className="relative overflow-hidden rounded-[1.75rem] card-sheen">
            <div className="flex items-center justify-between gap-3 border-b border-surface-200/70 px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-danger-500" />
                <span className="size-2.5 rounded-full bg-warning-500" />
                <span className="size-2.5 rounded-full bg-info-500" />
              </div>
              <code className="font-mono text-[11px] text-surface-400">@vaultui/tokens · tokens.css</code>
              <Badge variant="success" size="sm">live theme</Badge>
            </div>
            <div className="grid gap-px bg-surface-200/70 sm:grid-cols-2">
              {/* left column: type + color */}
              <div className="relative space-y-5 bg-surface-0 p-5 sm:p-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold leading-none">Aa</span>
                  <div>
                    <p className="text-sm font-semibold">Inter Variable</p>
                    <p className="font-mono text-[11px] text-surface-400">display · body · mono</p>
                  </div>
                </div>
                <div>
                  <LabLabel>brand scale</LabLabel>
                  <div className="flex h-8 w-full overflow-hidden rounded-lg shadow-inset">
                    {BRAND_SCALE.map((c) => (
                      <span key={c.hex} className="h-full flex-1" title={`brand-${c.name}`} style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
                <div>
                  <LabLabel>surface scale</LabLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {SURFACE_SCALE.slice(0, 8).map((c) => (
                      <span
                        key={c.hex}
                        title={`surface-${c.name}`}
                        className="size-7 rounded-md border border-surface-200/70"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* right column: real components */}
              <div className="relative space-y-4 bg-surface-0 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand" dot>Soft UI</Badge>
                  <Badge variant="info" dot>Token-driven</Badge>
                  <Badge variant="neutral">0 deps</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Card padding="sm" hover className="rounded-xl transition-transform duration-300 hover:-translate-y-0.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-surface-400">Sparkline</p>
                    <p className="mt-1 text-lg font-bold tracking-tight text-brand-600">+12.4%</p>
                    <Sparkline data={[8, 11, 9, 13, 12, 15, 14, 18]} colorClass="text-brand-600" className="mt-2 aspect-[100/28]" />
                  </Card>
                  <div className="flex flex-col justify-center gap-2.5">
                    <Button size="md" fullWidth>Primary</Button>
                    <Button size="md" variant="secondary" fullWidth>Secondary</Button>
                    <Button size="md" variant="ghost" fullWidth disabled>Disabled</Button>
                  </div>
                </div>
                <div className="rounded-xl bg-surface-100 p-3 shadow-inset">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-surface-500">
                    $ <span className="animate-caret text-brand-600">▌</span>
                    <span>pnpm add @vaultui/ui</span>
                  </div>
                </div>
              </div>
            </div>

            {/* inside the vault — the component inventory, one scrolling row */}
            <div className="flex items-center gap-x-3 gap-y-1.5 overflow-x-auto border-t border-surface-200/70 bg-surface-0 px-5 py-3 font-mono text-[11px] text-surface-400 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="shrink-0 font-semibold uppercase tracking-wider text-surface-500">Inside the vault</span>
              {["ChatCanvas", "KpiCard", "SankeyDiagram", "PricingTable", "LogStream", "KanbanBoard", "LiveCursors", "CronBuilder", "GiftCardBuilder", "GeoMap"].map((n) => (
                <span key={n} className="flex shrink-0 items-center gap-3">
                  <span className="text-brand-400">·</span>
                  {n}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* stats */}
        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-surface-200/70 shadow-soft sm:grid-cols-4">
          {[
            { k: `${TOTAL_COMPONENTS}`, v: "components" },
            { k: `${TOTAL_KITS}`, v: "kits, one system" },
            { k: "0", v: "UI dependencies" },
            { k: `${FREE_TIER}`, v: "components, free forever" },
          ].map((s) => (
            <div key={s.v} className="group bg-surface-0 px-4 py-4 text-center transition-colors duration-300 hover:bg-brand-50/40">
              <dt className="sr-only">{s.v}</dt>
              <dd className="text-2xl font-bold tracking-tight text-gradient-brand">{s.k}</dd>
              <dd className="mt-0.5 text-xs text-surface-500">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------- philosophy -------------------------------- */

const PILLARS = [
  {
    icon: <LayersIcon />,
    title: "Token-first, not patch-first",
    body: "One theme file drives every component's color, radius, shadow and motion. Re-brand the entire library by editing CSS variables — not forty-eight files.",
    tag: "theming",
  },
  {
    icon: <BoxesIcon />,
    title: "Dependency-light",
    body: "SVG, React, and Tailwind v4 — that's the whole stack. No chart engine, no drag library, no styling framework, no runtime CSS-in-JS to audit.",
    tag: "zero-dep",
  },
  {
    icon: <RowsIcon />,
    title: "Responsive-first",
    body: "Every surface scales at the same breakpoints, with the same spacing grid. Mobile isn't a mode you enter; it's the baseline every component is built from.",
    tag: "base-baseline",
  },
];

function Philosophy() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        kicker="A quiet philosophy"
        title={<>Most kits are collections.<br />This is a <em>system</em>.</>}
        body="Components drift. Systems don't. Vault UI is one set of decisions, applied consistently — so your product reads as designed, not assembled."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Card key={p.title} padding="lg" hover className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <span className="pointer-events-none absolute right-4 top-4 font-mono text-[11px] font-semibold text-surface-300 transition-colors duration-300 group-hover:text-brand-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 shadow-inset transition-all duration-300 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white">
              {p.icon}
            </div>
            <h3 className="mt-5 text-base font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-500">{p.body}</p>
            <code className="mt-5 self-start rounded-md bg-surface-100 px-2 py-0.5 font-mono text-[11px] text-surface-500">
              {p.tag}
            </code>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ design system ------------------------------ */
/* The signature section — the token engine, made visible.                     */

function SystemLab() {
  const { themeId } = useTheme();
  // Render the ACTIVE theme's tokens live (falls back to the static defaults
  // above when a token is missing) — the lab follows the switcher.
  const read = (token: string, fallback: string) => readTokenHex(token) || fallback;
  const scales = {
    brand: BRAND_SCALE.map((c) => ({ ...c, hex: read(`--color-brand-${c.name}`, c.hex) })),
    surface: SURFACE_SCALE.map((c) => ({ ...c, hex: read(`--color-surface-${c.name}`, c.hex) })),
    semantic: SEMANTIC_COLORS.map((c) => ({ ...c, hex: read(`--color-${c.name}-500`, c.hex) })),
  };

  return (
    <section id="system" className="scroll-mt-20 border-y border-surface-200/70 bg-surface-0/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="The design system"
          title={<>Every pixel, a decision.<br />Every token, a <em>standard</em>.</>}
          body="The lab below is not documentation from a screenshot — it is the live theme file rendered. What you adjust here is what every component reads."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {/* Color */}
          <Card padding="lg" className="lg:row-span-2">
            <PanelHeader icon={<PaletteIcon />} title="Color" caption="one accent · mid-tone neutrals · soft UI" />
            <div className="mt-5 space-y-5">
              <div>
                <LabLabel>brand · {BRAND_SCALE.length} steps</LabLabel>
                <ol className="overflow-hidden rounded-xl border border-surface-200/70">
                  {scales.brand.map((c) => (
                    <li
                      key={c.name}
                      className="flex items-center justify-between px-3 py-[7px] text-[11px]"
                      style={{ backgroundColor: c.hex, color: swatchText(c.hex) }}
                    >
                      <span className="font-mono font-semibold">brand-{c.name}</span>
                      <span className="font-mono uppercase opacity-80">{c.hex}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <LabLabel>surface · {SURFACE_SCALE.length} steps</LabLabel>
                  <ol className="overflow-hidden rounded-xl border border-surface-200/70">
                    {scales.surface.map((c) => (
                      <li
                        key={c.name}
                        className="flex items-center justify-between px-3 py-[5px] font-mono text-[10px]"
                        style={{ backgroundColor: c.hex, color: swatchText(c.hex) }}
                      >
                        <span className="font-semibold">{c.name}</span>
                        <span className="uppercase opacity-75">{c.hex}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <LabLabel>semantic</LabLabel>
                  <ul className="space-y-2">
                    {scales.semantic.map((c) => (
                      <li key={c.name} className="flex items-center justify-between rounded-lg bg-surface-50 px-3 py-2 shadow-inset">
                        <span className="flex items-center gap-2 text-xs font-medium text-surface-700">
                          <span className="size-3 rounded-full" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </span>
                        <code className="font-mono text-[10px] uppercase text-surface-400">{c.hex}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card padding="lg">
            <PanelHeader icon={<TypeIcon />} title="Typography" caption="Inter Variable · self-hosted · no CDN" />
            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-surface-100 p-4 shadow-inset">
                <p className="text-3xl font-bold leading-tight tracking-tight">Agile systems, quietly loud.</p>
                <p className="mt-1 text-sm leading-relaxed text-surface-500">
                  Body copy at a comfortable measure — legible before it is flamboyant.
                </p>
              </div>
              <div className="rounded-xl border border-surface-200/70 bg-surface-0 p-4">
                <p className="font-mono text-[13px] text-surface-600">
                  <span className="text-brand-600">pnpm add</span> @vaultui/tokens @vaultui/ui
                </p>
                <p className="mt-1 text-[11px] text-surface-400">
                  mono = JetBrains Mono · labels, code, metadata — <em>never</em> paragraphs
                </p>
              </div>
            </div>
          </Card>

          {/* Radii */}
          <Card padding="lg" className="lg:col-span-1">
            <PanelHeader icon={<SquircleIcon />} title="Radii" caption="generous, pill-friendly, one scale" />
            <div className="mt-5 flex items-end justify-between gap-2">
              {RADII.map((r, i) => (
                <div key={r.token} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className="w-full border border-surface-300 bg-gradient-to-br from-brand-100 to-brand-600"
                    style={{ height: 22 + i * 12, borderRadius: r.px }}
                  />
                  <span className="font-mono text-[10px] text-surface-500">{r.token}</span>
                  <span className="font-mono text-[10px] text-surface-400">{r.px}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-surface-400">
              The same six values shape buttons, chips, cards and dialogs — one table, no re-decisions.
            </p>
          </Card>

          {/* Elevation */}
          <Card padding="lg">
            <PanelHeader
              icon={<ShadowIcon />}
              title="Elevation"
              caption={ELEVATION_CAPTIONS[themeId] ?? "elevation · token-driven"}
            />
            <div className="mt-5 space-y-3">
              {[
                { name: "shadow-soft", cls: "shadow-soft", note: "resting surfaces" },
                { name: "shadow-raised", cls: "shadow-raised", note: "dialogs, hero cards" },
                { name: "shadow-inset", cls: "shadow-inset", note: "fields, pressed states" },
              ].map((s) => (
                <div
                  key={s.name}
                  className={cn("flex items-center justify-between rounded-xl bg-surface-0 px-4 py-3", s.cls)}
                >
                  <code className="font-mono text-xs font-semibold text-surface-700">{s.name}</code>
                  <span className="text-[11px] text-surface-400">{s.note}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Motion */}
          <Card padding="lg">
            <PanelHeader icon={<WandIcon />} title="Motion" caption="fast, calm, respectful of reduced-motion" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-100 p-4 shadow-inset">
                <p className="font-mono text-xs text-surface-400">animate-caret</p>
                <p className="mt-2 font-mono text-sm text-surface-700">
                  streaming<span className="animate-caret text-brand-600">▌</span>
                </p>
              </div>
              <div className="rounded-xl bg-surface-100 p-4 shadow-inset">
                <p className="font-mono text-xs text-surface-400">animate-bounce-dot</p>
                <div className="mt-3 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2 rounded-full bg-brand-600 animate-bounce-dot"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-surface-400">
              Cursors, dots, pulse rings and rise transitions — snappy in, quiet out. Respects{" "}
              <code className="font-mono text-[10px]">prefers-reduced-motion</code>.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- kits ----------------------------------- */

function KitsSection({ onBrowse }: { onBrowse: () => void }) {
  return (
    <section id="kits" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        kicker="Seven kits, one language"
        title={<>Built for the product,<br />not the <em>demo</em>.</>}
        body="Each kit solves a real product surface end-to-end. They share props, tokens and spacing rules, so mixing kits mid-feature never feels like mixing libraries."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KITS.map((k) => (
          <Card key={k.name} padding="lg" hover className={cn("group relative flex flex-col overflow-hidden border-t-4 transition-all duration-300 hover:-translate-y-1", k.accentBorder)}>
            <div className="flex items-center justify-between">
              <span className={cn("flex size-11 items-center justify-center rounded-xl shadow-inset transition-transform duration-300 group-hover:scale-105", k.accent)}>
                <k.icon className="size-5" />
              </span>
              <Badge variant="brand" size="sm">
                {k.count} components
              </Badge>
            </div>
            <h3 className="mt-5 text-base font-semibold tracking-tight">{k.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-500">{k.blurb}</p>
            <code className="mt-5 self-start rounded-md bg-surface-100 px-2 py-0.5 font-mono text-[11px] text-brand-700">
              {k.pkg}
            </code>
          </Card>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-5 text-center sm:p-6">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <p className="text-sm leading-relaxed text-surface-600">
            <span className="font-semibold text-brand-700">Free tier — the whole core kit.</span>{" "}
            {FREE_TIER} primitives and form controls (MIT, on npm) + {DASHBOARD_COUNT} full dashboard templates to preview.
          </p>
          <Button size="sm" onClick={onBrowse}>Try them now</Button>
        </div>
      </div>

      {/* Dashboard templates */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold tracking-tight">Dashboard templates</h3>
          <Badge variant="brand" size="sm">{DASHBOARD_COUNT} templates</Badge>
        </div>
        <Card padding="lg" className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["Executive", "Realtime Monitoring", "Drill-Down Analytics", "Predictive", "Financial"].map((d) => (
              <span key={d} className="rounded-full border border-surface-200 bg-surface-0 px-3 py-1.5 font-mono text-xs text-surface-600">
                {d}
              </span>
            ))}
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-surface-500">
            Full-page products composed from Vault components — token-driven, so every template re-skins across all four themes.
          </p>
          <Button size="sm" variant="secondary" onClick={onBrowse}>
            Preview in the vault
          </Button>
        </Card>
      </div>
    </section>
  );
}

/* -------------------------------- licensing -------------------------------- */

function Licensing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-y border-surface-200/70 bg-surface-0/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Licensing, in plain language"
          title={<>Free where it should be.<br />Paid where it <em>must</em> be.</>}
          body="No trials, no seats, no phone calls. The core is open; the premium kits are a straight-forward commercial license with the source included."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card padding="lg" shadow="soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">Free core</h3>
              <Badge variant="success" dot>MIT</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-surface-500">
              The theme engine and the three primitives it styles — on the public npm registry, no
              account required, forever.
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-surface-200/70 pt-5">
              {[
                ["@vaultui/tokens", "the DNA — palette, radii, shadows, motion"],
                ["@vaultui/utils", "cn() + the helper the library is built on"],
                ["@vaultui/ui", `${FREE_TIER} primitives: buttons, forms, overlays, feedback`],
              ].map(([pkg, desc]) => (
                <li key={pkg} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success-500" />
                  <span>
                    <code className="font-mono text-[13px] font-semibold text-surface-700">{pkg}</code>
                    <span className="text-surface-400"> — {desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg" shadow="raised" className="relative overflow-hidden bg-gradient-to-br from-surface-0 to-brand-50/50">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-200/50 blur-2xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">Premium kits</h3>
              <Badge variant="brand" dot>Commercial</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-surface-500">
              {TOTAL_COMPONENTS - FREE_TIER} components across {TOTAL_KITS} kits. One license, all kits —
              source code ships with it, and the public registry stays intentionally quiet.
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-surface-200/70 pt-5">
              {KITS.map((k) => (
                <li key={k.name} className="flex items-center justify-between text-sm">
                  <span className="text-surface-700">
                    <k.icon className="mr-2 inline size-4 align-[-2px] text-surface-500" />
                    {k.name}
                  </span>
                  <code className="font-mono text-[11px] text-surface-400">{k.count} components</code>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- install --------------------------------- */

function InstallSection({ onBrowse }: { onBrowse: () => void }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [manager, setManager] = useState<PackageManagerId>("npm");
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const activeCommand = PACKAGE_MANAGERS.find((m) => m.id === manager)!.command;

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(activeCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleDownload = async () => {
    // Signed-out visitors are routed to sign-in — the kit is post-login.
    if (!isSignedIn) {
      navigate("/sign-in", { state: { from: "/docs" } });
      return;
    }
    setDownloading(true);
    try {
      await import("../docs/downloadKit").then((m) => m.downloadKit());
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="install" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        kicker="One line, then yours"
        title={<>Start in seconds.<br />Ship for <em>years</em>.</>}
        body="Install the free core from npm, or download the kit bundle — theme file, per-component usage, and a runnable starter app."
      />

      <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-surface-800 bg-surface-950 shadow-raised ring-1 ring-brand-500/20">
        <div className="flex items-center justify-between gap-2 border-b border-surface-800 bg-surface-900 px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-danger-500" />
            <span className="size-2.5 rounded-full bg-warning-500" />
            <span className="size-2.5 rounded-full bg-success-500" />
          </div>
          <div
            role="tablist"
            aria-label="Package manager"
            className="flex items-center gap-0.5 rounded-lg bg-surface-800/70 p-0.5 font-mono text-[11px]"
          >
            {PACKAGE_MANAGERS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={manager === m.id}
                onClick={() => setManager(m.id)}
                className={cn(
                  "rounded-md px-2 py-1 transition-colors",
                  manager === m.id
                    ? "bg-surface-700 text-surface-100"
                    : "text-surface-500 hover:text-surface-300",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={copyInstall}
            aria-label="Copy install command"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] transition-colors",
              copied ? "bg-success-500/20 text-success-500" : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "copied" : "copy"}
          </button>
        </div>
        <div className="flex items-start gap-3 p-5">
          <span aria-hidden="true" className="mt-1 font-mono text-sm text-success-500">$</span>
          <code className="font-mono text-[13px] leading-relaxed text-surface-100">{activeCommand}</code>
        </div>
        <p className="mt-3 font-mono text-[11px] text-surface-400">
          …or a single component: <code className="text-brand-400">npx vault-ui add switch modal</code>
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          className="sm:w-auto"
          onClick={handleDownload}
          disabled={downloading}
          leadingIcon={downloading ? <Package className="size-5 animate-pulse" /> : <Download className="size-5" />}
        >
          {downloading ? "Packing zip…" : "Or download the kit (.zip)"}
        </Button>
        <Button
          size="lg"
          variant="ghost"
          fullWidth
          className="sm:w-auto"
          leadingIcon={<Terminal className="size-5" />}
          onClick={onBrowse}
        >
          Read the API docs
        </Button>
      </div>
    </section>
  );
}

/* --------------------------------- final cta -------------------------------- */

function FinalCta({ onBrowse }: { onBrowse: () => void }) {
  return (
    <section className="relative overflow-hidden border-t border-surface-200/70">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-20 text-center sm:px-6">
        <figure className="mx-auto max-w-xl">
          <blockquote className="text-lg font-light italic leading-relaxed text-surface-600">
            “A product feels designed when the details never have to be explained.”
          </blockquote>
          <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-surface-400">— the principle this library is built around</figcaption>
        </figure>
        <h2 className="mt-8 text-3xl font-bold tracking-tight sm:text-5xl">
          Now build something that
          <br />
          <span className="text-gradient-brand">feels inevitable.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-surface-500">
          {TOTAL_COMPONENTS} components, {TOTAL_KITS} kits, one token engine. The details are handled —
          go make the product worth them.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="xl" onClick={onBrowse} trailingIcon={<ArrowRight className="size-5" />} fullWidth className="sm:w-auto">
            Start browsing
          </Button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-lg px-5 text-base font-medium text-surface-600 transition-colors hover:bg-surface-100"
          >
            <GitHubIcon className="size-5" /> Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- footer ---------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-surface-200/70 bg-surface-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <VaultLogo size={28} />
            <span className="text-sm font-semibold tracking-tight">Vault UI</span>
            <span className="text-xs text-surface-400">— premium React + Tailwind components</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-surface-500">
            <a href="#system" className="transition-colors hover:text-surface-900">Design system</a>
            <a href="#kits" className="transition-colors hover:text-surface-900">Kits</a>
            <a href="#pricing" className="transition-colors hover:text-surface-900">Licensing</a>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-surface-900">
              GitHub
            </a>
          </nav>
        </div>
        <p className="mt-8 text-center font-mono text-[11px] text-surface-400 sm:text-left">
          MIT + Commercial · {TOTAL_COMPONENTS} components · token-driven · the details are not the details
        </p>
      </div>
    </footer>
  );
}

/* --------------------------------- helpers ---------------------------------- */

function SectionHeading({ kicker, title, body }: { kicker: string; title: React.ReactNode; body: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-surface-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-surface-500">{body}</p>
    </div>
  );
}

function LabLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-surface-400">{children}</p>
  );
}

function PanelHeader({ icon, title, caption }: { icon: React.ReactNode; title: string; caption: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 shadow-inset">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <p className="mt-0.5 font-mono text-[11px] text-surface-400">{caption}</p>
      </div>
    </div>
  );
}

/* ---------------------------------- icons ----------------------------------- */

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0012 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.75l8.25 4.5-8.25 4.5-8.25-4.5 8.25-4.5zM3.75 12l8.25 4.5 8.25-4.5M3.75 16.5l8.25 4.5 8.25-4.5" />
    </svg>
  );
}

function BoxesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.5l9.75-4.5 9.75 4.5M12 12.75v6.75m0-6.75l-9.75-4.5M12 12.75l9.75-4.5M3.75 12.75v4.5a.75.75 0 00.37.65l7.13 4.1a.75.75 0 00.75 0l7.13-4.1a.75.75 0 00.37-.65v-4.5" />
    </svg>
  );
}

function RowsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 119-9c0 2.485-2.099 3.75-4.5 3.75h-2.25a1.5 1.5 0 00-1.483 1.77c.08.42.033.856-.13 1.25A1.5 1.5 0 0112 21zM7.5 12a.75.75 0 100-1.5.75.75 0 000 1.5zm4.5-4.5a.75.75 0 100-1.5.75.75 0 000 1.5zM7.5 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
  );
}

function TypeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.25h16M12 5.25v13.5M9.75 18.75h4.5" />
    </svg>
  );
}

function SquircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
    </svg>
  );
}

function ShadowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <rect x="4.5" y="4.5" width="12" height="12" rx="3" transform="rotate(0 4.5 4.5)" />
      <path strokeLinecap="round" d="M19.5 9v9a1.5 1.5 0 01-1.5 1.5H9" />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5L19.5 9.75M4.5 19.5l9.75-9.75M19.5 4.5L4.5 19.5M16.875 8.625l1.875-1.875M6.375 13.125L4.5 15M18.75 12.75v4.5M16.5 15h4.5" />
    </svg>
  );
}