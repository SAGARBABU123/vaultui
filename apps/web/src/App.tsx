import { useState } from "react";
import { Badge, Button, Card } from "@vault/ui";
import { cn } from "@vault/utils";

/* ---------------------------------- data ---------------------------------- */

const brandSwatches = [
  "bg-brand-50",
  "bg-brand-100",
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-400",
  "bg-brand-500",
  "bg-brand-600",
  "bg-brand-700",
  "bg-brand-800",
  "bg-brand-900",
  "bg-brand-950",
];

const surfaceSwatches = [
  "bg-surface-50",
  "bg-surface-100",
  "bg-surface-200",
  "bg-surface-300",
  "bg-surface-400",
  "bg-surface-500",
  "bg-surface-600",
  "bg-surface-700",
  "bg-surface-800",
  "bg-surface-900",
  "bg-surface-950",
];

const features = [
  { title: "Mobile-first", desc: "Every component ships with mobile-first defaults — no desktop-first hacks." },
  { title: "Fluid layouts", desc: "Stack on small screens, line up on large — built with sm/md/lg variants." },
  { title: "Token-driven", desc: "One CSS file re-brands the entire kit. Light/dark ready." },
  { title: "Accessible", desc: "Keyboard focus rings, aria labels, and 44px-friendly touch targets." },
];

const kits = [
  { name: "AI Agent Kit", desc: "Token streamers, tool-call inspectors, agent canvases", emoji: "🤖", phase: "Phase 1" },
  { name: "Data Viz Pro", desc: "Sankey, candlesticks, heatmaps — beyond Recharts", emoji: "📈", phase: "Phase 3" },
  { name: "Commerce Kit", desc: "Cart drawers, refund wizards, tier compare", emoji: "🛒", phase: "Phase 4" },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    desc: "Foundation components to get you started.",
    features: ["Buttons, badges, cards", "Token theming", "MIT license"],
    cta: "Start free",
    variant: "secondary" as const,
  },
  {
    name: "Pro",
    price: "$49",
    desc: "Every premium kit + full source access.",
    features: ["All 3 kits + future kits", "Source access", "Lifetime updates"],
    cta: "Buy Pro",
    variant: "primary" as const,
    highlight: true,
  },
  {
    name: "Team",
    price: "$149",
    desc: "For product teams building together.",
    features: ["5 seats", "Priority support", "Custom brand tokens"],
    cta: "Contact sales",
    variant: "secondary" as const,
  },
];

/* ---------------------------------- app ---------------------------------- */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      {menuOpen && <MobileMenu onNavigate={() => setMenuOpen(false)} />}

      <main>
        <Hero />
        <FeatureStrip />
        <ButtonsShowcase />
        <BadgesShowcase />
        <CardsShowcase />
        <ResponsiveDemo />
        <TokensShowcase />
        <KitsShowcase />
      </main>

      <Footer />
    </div>
  );
}

/* --------------------------------- header -------------------------------- */

const NAV_LINKS = [
  { label: "Components", href: "#components" },
  { label: "Tokens", href: "#tokens" },
  { label: "Pricing", href: "#pricing" },
  { label: "Kits", href: "#kits" },
];

function Header({
  menuOpen,
  onToggleMenu,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-surface-200 bg-surface-0/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            V
          </span>
          <span>
            Vault&nbsp;UI
            <span className="ml-2 hidden rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-700 sm:inline-block">
              v0.0.1
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            GitHub
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex size-10 items-center justify-center rounded-lg text-surface-600 transition-colors hover:bg-surface-100 md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="border-b border-surface-200 bg-surface-0 px-4 py-3 md:hidden">
      <nav className="flex flex-col gap-1" aria-label="Mobile">
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className="rounded-lg px-3 py-3 text-base font-medium text-surface-700 hover:bg-surface-100"
          >
            {l.label}
          </a>
        ))}
        <div className="mt-2 flex flex-col gap-2 border-t border-surface-200 pt-3">
          <Button fullWidth variant="secondary" onClick={onNavigate}>
            GitHub
          </Button>
          <Button fullWidth onClick={onNavigate}>
            Get started
          </Button>
        </div>
      </nav>
    </div>
  );
}

/* ---------------------------------- hero --------------------------------- */

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-24">
      <Badge variant="brand" className="mb-5" dot>
        Responsive-first · Tailwind v4 · Turborepo
      </Badge>

      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Premium components.
        <br />
        <span className="text-brand-600">The ones you can't find elsewhere.</span>
      </h1>

      <p className="mt-5 max-w-xl text-base text-surface-500 sm:text-lg">
        Every color, shadow, and radius comes from one design-token file. Every
        component is mobile-first. Zero desktop-first hacks.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="lg" fullWidth className="sm:w-auto" onClick={() => document.querySelector("#components")?.scrollIntoView({ behavior: "smooth" })}>
          Browse components
        </Button>
        <Button size="lg" variant="secondary" fullWidth className="sm:w-auto">
          Read the docs
        </Button>
      </div>
    </section>
  );
}

/* ---------------------------------- features ------------------------------ */

function FeatureStrip() {
  return (
    <section className="border-y border-surface-200 bg-surface-0">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {features.map((f) => (
          <div key={f.title}>
            <h3 className="text-sm font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-surface-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- showcase -------------------------------- */

function SectionHeading({
  id,
  kicker,
  title,
  desc,
}: {
  id?: string;
  kicker: string;
  title: string;
  desc: string;
}) {
  return (
    <div id={id} className="mb-8">
      <Badge variant="neutral" size="sm">
        {kicker}
      </Badge>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-surface-500">{desc}</p>
    </div>
  );
}

function ShowcaseShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      {children}
    </section>
  );
}

function ButtonsShowcase() {
  return (
    <ShowcaseShell>
      <SectionHeading
        kicker="Free tier · Button"
        title="Five sizes, four variants — responsive by default"
        desc='Sizes run xs → xl: xs for dense rows, sm as the minimum comfortable touch target, lg/xl for hero CTAs. On small screens pair `fullWidth` with `className="w-full sm:w-auto"`.'
      />

      {/* Variants — first row fixed order (not wrap) */}
      <Card className="mb-4" padding="lg">
        <h3 className="mb-4 text-sm font-semibold text-surface-500">Variants</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </Card>

      <Card className="mb-4" padding="lg">
        <h3 className="mb-4 text-sm font-semibold text-surface-500">Sizes (xs · sm · md · lg · xl)</h3>
        <div className="flex flex-wrap items-end gap-3">
          <Button size="xs">xs — 28px</Button>
          <Button size="sm">sm — 36px</Button>
          <Button size="md">md — 40px</Button>
          <Button size="lg">lg — 48px</Button>
          <Button size="xl">xl — 56px</Button>
        </div>
      </Card>

      <Card className="mb-4" padding="lg">
        <h3 className="mb-4 text-sm font-semibold text-surface-500">With icons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" leadingIcon={<ArrowIcon />}>
            Leading
          </Button>
          <Button variant="secondary" trailingIcon={<ArrowIcon />}>
            Trailing
          </Button>
          <Button variant="secondary" size="lg" leadingIcon={<ArrowIcon />}>
            Large with icon
          </Button>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="mb-4 text-sm font-semibold text-surface-500">States</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button loading variant="secondary" size="sm">
            Saving…
          </Button>
        </div>
      </Card>
    </ShowcaseShell>
  );
}

function BadgesShowcase() {
  return (
    <ShowcaseShell>
      <SectionHeading
        kicker="Free tier · Badge"
        title="Status chips for every situation"
        desc="Six tonal variants with an optional status dot. Wrap gracefully on narrow screens."
      />

      <Card padding="lg">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Neutral</Badge>
          <Badge variant="brand" dot>
            Brand
          </Badge>
          <Badge variant="success" dot>
            Live
          </Badge>
          <Badge variant="warning" dot>
            Warning
          </Badge>
          <Badge variant="danger" dot>
            Failed
          </Badge>
          <Badge variant="info" dot>
            New
          </Badge>
          <Badge size="sm">Small badge</Badge>
          <Badge size="sm" variant="danger">
            sm · danger
          </Badge>
        </div>
      </Card>
    </ShowcaseShell>
  );
}

function CardsShowcase() {
  return (
    <ShowcaseShell>
      <SectionHeading
        kicker="Free tier · Card"
        title="Pricing tiers that adapt to the screen"
        desc="Cards stack to one column on mobile, two on tablet, three on desktop — and every CTA goes full-width until there's room."
      />

      <div id="pricing" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tiers.map((t) => (
          <Card
            key={t.name}
            padding="lg"
            shadow={t.highlight ? "raised" : "soft"}
            hover
            className={cn(
              "flex flex-col",
              t.highlight && "border-brand-400 ring-1 ring-brand-400/40",
            )}
          >
            {t.highlight && (
              <Badge variant="brand" size="sm" className="mb-3 self-start" dot>
                Most popular
              </Badge>
            )}
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-surface-500">{t.desc}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">{t.price}</span>
              <span className="text-sm text-surface-400">/ one-time</span>
            </div>
            <ul className="mt-5 flex-1 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-surface-600">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={t.variant}
              fullWidth
              className="mt-6"
              onClick={() =>
                document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t.cta}
            </Button>
          </Card>
        ))}
      </div>
    </ShowcaseShell>
  );
}

function ResponsiveDemo() {
  return (
    <ShowcaseShell>
      <SectionHeading
        kicker="Responsive pattern"
        title="See it with your own eyes — resize the window"
        desc="The row below is `flex-col` on mobile, `flex-row` on desktop. Watch the button flip from full-width to auto width as the viewport grows."
      />

      <Card padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold">Ship the AI Kit</h3>
            <p className="mt-1 text-sm text-surface-500">
              On mobile this copy and the action stack; on desktop they sit side-by-side.
            </p>
          </div>
          <Button fullWidth className="sm:w-auto" variant="secondary">
            Configure
          </Button>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card padding="lg">
          <h3 className="text-sm font-semibold">Tip A</h3>
          <p className="mt-1 text-sm text-surface-500">
            Use <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-xs">fullWidth</code> +{" "}
            <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-xs">"w-full sm:w-auto"</code>{" "}
            for CTAs that never feel cramped on a phone.
          </p>
        </Card>
        <Card padding="lg">
          <h3 className="text-sm font-semibold">Tip B</h3>
          <p className="mt-1 text-sm text-surface-500">
            Every Vault component is <em>mobile-first</em>: base styles target the phone,{" "}
            <code className="rounded bg-surface-100 px-1.5 py-0.5 font-mono text-xs">sm:</code>{" "}
            and up add width.
          </p>
        </Card>
      </div>
    </ShowcaseShell>
  );
}

function TokensShowcase() {
  return (
    <ShowcaseShell>
      <SectionHeading
        kicker="Design tokens"
        title="One file. Entire brand."
        desc="Swatch rows reflow from 6 columns (mobile) to 11 (desktop). Override tokens.css and this whole page re-brands."
      />

      <div id="tokens" className="grid gap-6 lg:grid-cols-2">
        {[
          { label: "Brand scale", src: "bg-brand-", swatches: brandSwatches, text: "text-surface-0" },
          { label: "Surface scale", src: "bg-surface-", swatches: surfaceSwatches, text: "text-surface-900" },
        ].map((row) => (
          <Card key={row.label} padding="lg">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{row.label}</h3>
              <code className="truncate font-mono text-xs text-surface-400">--color-{row.src}*</code>
            </div>
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11 sm:gap-2">
              {row.swatches.map((c) => (
                <div
                  key={c}
                  className={cn("aspect-square rounded-md sm:rounded-lg", row.text, c)}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ShowcaseShell>
  );
}

function KitsShowcase() {
  return (
    <ShowcaseShell>
      <SectionHeading
        kicker="Coming kits"
        title="The premium shelf"
        desc="The components you can't find in shadcn or Aceternity — one kit at a time."
      />

      <div id="kits" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {kits.map((kit) => (
          <Card key={kit.name} padding="lg" hover className="flex flex-col">
            <div className="text-3xl">{kit.emoji}</div>
            <h3 className="mt-3 text-lg font-semibold">{kit.name}</h3>
            <p className="mt-1 flex-1 text-sm text-surface-500">{kit.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="info" size="sm" dot>
                {kit.phase}
              </Badge>
              <Button variant="ghost" size="sm" leadingIcon={<ArrowIcon />}>
                Notify me
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ShowcaseShell>
  );
}

/* --------------------------------- footer -------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-0">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center text-sm text-surface-400 sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
        <p>
          Vault UI — monorepo: <code className="font-mono text-xs">turborepo</code> ·{" "}
          <code className="font-mono text-xs">react</code> ·{" "}
          <code className="font-mono text-xs">tailwind v4</code>
        </p>
        <p>© 2026 Vault UI. Working title</p>
      </div>
    </footer>
  );
}

/* --------------------------------- icons --------------------------------- */

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={cn("size-4", className)} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}