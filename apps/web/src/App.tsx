import { Button } from "@vault/ui";
import { cn } from "@vault/utils";

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

export default function App() {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-surface-200 bg-surface-0/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
              V
            </span>
            Vault&nbsp;UI
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
              UI Server
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Tokens
            </Button>
            <Button variant="secondary" size="sm">
              Components
            </Button>
            <Button size="sm">Get started</Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        {/* Hero */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Premium components.
            <br />
            <span className="text-brand-600">The ones you can't find elsewhere.</span>
          </h1>
          <p className="mt-4 max-w-xl text-surface-500">
            Every color, shadow, and radius below comes from the design-token
            engine (<code className="rounded bg-surface-200 px-1.5 py-0.5 font-mono text-xs">@vault/tokens</code>).
            Re-brand the whole kit by overriding one file.
          </p>
        </section>

        {/* Buttons */}
        <section className="mb-16 grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-lg font-semibold">Button</h2>
            <p className="mt-2 text-sm text-surface-500">
              From the free tier in <code className="font-mono text-xs">@vault/ui</code> —
              variants, sizes, loading, icons, full-width. Used everywhere in this app.
            </p>
          </div>
          <div className="grid gap-6 rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-soft">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" leadingIcon={<ArrowIcon />}>
                With icon
              </Button>
              <Button variant="secondary" trailingIcon={<ArrowIcon className="rotate-90" />}>
                Trailing icon
              </Button>
              <Button fullWidth>
                Full width
              </Button>
            </div>
          </div>
        </section>

        {/* Tokens */}
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold">Brand scale</h2>
            <p className="mt-2 text-sm text-surface-500">
              Generated from <code className="font-mono text-xs">--color-brand-*</code>.
            </p>
            <div className="mt-4 flex gap-2">
              {brandSwatches.map((c) => (
                <span key={c} className={cn("h-10 flex-1 rounded-md", c)} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Surface scale</h2>
            <p className="mt-2 text-sm text-surface-500">
              Generated from <code className="font-mono text-xs">--color-surface-*</code>.
            </p>
            <div className="mt-4 flex gap-2">
              {surfaceSwatches.map((c) => (
                <span key={c} className={cn("h-10 flex-1 rounded-md", c)} />
              ))}
            </div>
          </div>
        </section>

        {/* Kits roadmap */}
        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { name: "AI Agent Kit", desc: "Token streamers, tool-call inspectors, agent canvases", emoji: "🤖" },
            { name: "Data Viz Pro", desc: "Sankey, candlesticks, heatmaps — beyond Recharts", emoji: "📈" },
            { name: "Commerce Kit", desc: "Cart drawers, refund wizards, tier compare", emoji: "🛒" },
          ].map((kit) => (
            <div
              key={kit.name}
              className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft transition-colors hover:border-brand-300"
            >
              <div className="text-2xl">{kit.emoji}</div>
              <h3 className="mt-3 font-semibold">{kit.name}</h3>
              <p className="mt-1 text-sm text-surface-500">{kit.desc}</p>
              <span className="mt-3 inline-block rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600">
                Phase {kit.name === "AI Agent Kit" ? "1" : kit.name === "Data Viz Pro" ? "3" : "4"}
              </span>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-surface-200 py-8 text-center text-sm text-surface-400">
        Vault UI — monorepo: <code className="font-mono text-xs">turborepo</code> ·{" "}
        <code className="font-mono text-xs">react</code> ·{" "}
        <code className="font-mono text-xs">tailwind v4</code>
      </footer>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}