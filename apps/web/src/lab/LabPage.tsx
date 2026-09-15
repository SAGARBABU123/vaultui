import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Input, Progress, Switch } from "@vaultui/ui";
import { BarChart, KpiCard } from "@vaultui/data-viz";
import "@vaultui/data-viz/dataviz.css"; // BarChart/KpiCard chrome — not global
import { ArrowLeft, Check, Copy, Download } from "lucide-react";
import { DocsHeader } from "../layout/DocsHeader";
import { ALL_COMPONENTS, ALL_DASHBOARDS } from "../projects/entries";

/**
 * Rebrand Lab — a writable token editor.
 *
 * Drag the accent hue, radius scale and elevation depth; the preview screen
 * (real Vault components) re-skins live via CSS variables scoped to the page;
 * then copy or export the generated token override.
 */

/* ------------------------------ color math ------------------------------- */

function hsl(h: number, s: number, l: number): string {
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Brand scale for a hue, shaped like the stock Vault curve (50 … 950). */
function brandScale(hue: number): string[] {
  const curve: Array<[number, number]> = [
    [96, 22],
    [94, 30],
    [91, 42],
    [87, 55],
    [81, 68],
    [72, 75],
    [63, 75],
    [54, 70],
    [45, 63],
    [37, 55],
    [30, 48],
  ];
  return curve.map(([l, s]) => hsl(hue, s, l));
}

const BRAND_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

const ACCENT_PRESETS: Array<{ name: string; hue: number }> = [
  { name: "Indigo", hue: 236 },
  { name: "Blue", hue: 216 },
  { name: "Cyan", hue: 190 },
  { name: "Emerald", hue: 158 },
  { name: "Amber", hue: 38 },
  { name: "Rose", hue: 344 },
];

const BASE_RADII = [0.375, 0.5, 0.75, 1, 1.25, 1.5];
const RADII_STEPS = ["xs", "sm", "md", "lg", "xl", "2xl"];

type Elevation = "flat" | "soft" | "deep";

const ELEVATION_PRESETS: Record<Elevation, Record<string, string>> = {
  flat: {
    "--shadow-soft": "0 0 0 transparent",
    "--shadow-raised": "0 0 0 transparent",
    "--shadow-popover": "0 0 0 transparent",
    "--shadow-inset": "inset 0 0 0 transparent",
    "--shadow-pressed": "inset 0 0 0 transparent",
  },
  soft: {
    "--shadow-soft": "6px 6px 14px rgb(163 177 198 / 0.55), -6px -6px 14px rgb(255 255 255 / 0.8)",
    "--shadow-raised": "10px 10px 22px rgb(163 177 198 / 0.55), -10px -10px 22px rgb(255 255 255 / 0.85)",
    "--shadow-popover": "14px 14px 32px rgb(140 155 180 / 0.5), -6px -6px 16px rgb(255 255 255 / 0.75)",
    "--shadow-inset": "inset 3px 3px 7px rgb(163 177 198 / 0.55), inset -3px -3px 7px rgb(255 255 255 / 0.7)",
    "--shadow-pressed": "inset 4px 4px 9px rgb(163 177 198 / 0.6), inset -4px -4px 9px rgb(255 255 255 / 0.7)",
  },
  deep: {
    "--shadow-soft": "8px 8px 20px rgb(70 84 120 / 0.45), -8px -8px 20px rgb(255 255 255 / 0.9)",
    "--shadow-raised": "16px 16px 34px rgb(70 84 120 / 0.48), -10px -10px 28px rgb(255 255 255 / 0.95)",
    "--shadow-popover": "24px 24px 56px rgb(60 74 110 / 0.5), -8px -8px 24px rgb(255 255 255 / 0.85)",
    "--shadow-inset": "inset 5px 5px 11px rgb(70 84 120 / 0.5), inset -5px -5px 11px rgb(255 255 255 / 0.75)",
    "--shadow-pressed": "inset 6px 6px 14px rgb(70 84 120 / 0.55), inset -6px -6px 14px rgb(255 255 255 / 0.75)",
  },
};

/* --------------------------------- page --------------------------------- */

export function LabPage() {
  const navigate = useNavigate();
  const [hue, setHue] = useState(236);
  const [radius, setRadius] = useState(1);
  const [elevation, setElevation] = useState<Elevation>("soft");
  const [copied, setCopied] = useState(false);

  const scale = useMemo(() => brandScale(hue), [hue]);

  const overrides = useMemo(() => {
    const vars: Record<string, string> = {};
    BRAND_STEPS.forEach((step, i) => (vars[`--color-brand-${step}`] = scale[i]!));
    RADII_STEPS.forEach((step, i) => (vars[`--radius-${step}`] = `${Math.max(0, BASE_RADII[i]! * radius)}rem`));
    return { ...vars, ...ELEVATION_PRESETS[elevation] };
  }, [scale, radius, elevation]);

  const exportCss = () =>
    [
      "/* Vault UI — generated brand override (paste after the @theme block in tokens.css) */",
      ":root {",
      ...Object.entries(overrides).map(([k, v]) => `  ${k}: ${v};`),
      "}",
      "",
    ].join("\n");

  const onExport = () => {
    const blob = new Blob([exportCss()], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vault-theme.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportCss());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <DocsHeader
        componentTotal={ALL_COMPONENTS.length - 1}
        dashboardTotal={ALL_DASHBOARDS.length}
        onOpenDrawer={() => undefined}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
              {/* Back to the vault */}
      <button
        type="button"
        onClick={() => navigate("/docs")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </button>

<div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">Rebrand lab</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Drag it. <span className="text-gradient-brand">Feel it.</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-500">
              A writable token editor — every control writes CSS variables live, the preview screen
              (real components) re-skins instantly, and you export the exact override.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={onCopy} leadingIcon={copied ? <Check className="size-4 text-success-500" /> : <Copy className="size-4" />}>
              {copied ? "Copied!" : "Copy tokens"}
            </Button>
            <Button size="sm" onClick={onExport} leadingIcon={<Download className="size-4" />}>
              Export tokens.css
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Controls */}
          <div className="space-y-6 lg:col-span-1">
            <Card padding="lg" className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-800">Accent hue</span>
                  <span className="font-mono text-xs text-surface-400">{hue}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full accent-brand-600"
                  aria-label="Accent hue"
                />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ACCENT_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setHue(p.hue)}
                      className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
                      style={{
                        background: hsl(p.hue, 70, 60),
                        color: p.hue > 45 && p.hue < 165 ? "#10233d" : "#fff",
                        outline: hue === p.hue ? "2px solid var(--color-brand-600)" : "none",
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full shadow-inset">
                  {scale.map((c, i) => (
                    <span key={i} style={{ backgroundColor: c }} className="h-full flex-1" title={`brand-${BRAND_STEPS[i]}`} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-800">Radius scale</span>
                  <span className="font-mono text-xs text-surface-400">×{radius.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={2}
                  step={0.02}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-brand-600"
                  aria-label="Radius scale"
                />
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold text-surface-800">Elevation</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["flat", "soft", "deep"] as Elevation[]).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setElevation(e)}
                      className={cnChip(elevation === e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-surface-100 p-3 shadow-inset">
                <p className="font-mono text-[10px] uppercase tracking-widest text-surface-400">Generated override</p>
                <pre className="mt-2 max-h-40 overflow-auto font-mono text-[10px] leading-relaxed text-surface-600">
                  {Object.entries(overrides)
                    .map(([k, v]) => `${k}: ${v};`)
                    .join("\n")}
                </pre>
              </div>
            </Card>
          </div>

          {/* Live preview */}
          <div className="lg:col-span-2">
            <div data-theme="lab" className="overflow-hidden rounded-3xl border border-surface-200 shadow-raised">
              <div className="flex items-center justify-between gap-2 border-b border-surface-200/70 bg-surface-0 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: overrides["--color-brand-600"] }}>
                    V
                  </span>
                  <span className="text-sm font-semibold">Acme App</span>
                </div>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-danger-500" />
                  <span className="size-2.5 rounded-full bg-warning-500" />
                  <span className="size-2.5 rounded-full bg-info-500" />
                </div>
              </div>

              <div className="space-y-4 bg-surface-50 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Good morning, Sagar</h2>
                    <p className="text-xs text-surface-500">Here's how the product is moving this week.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary">Docs</Button>
                    <Button size="sm">New report</Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <KpiCard label="Revenue" value={48200} delta={12.4} trend={[40, 60, 55, 80, 90]} hint="vs last week" />
                  <KpiCard label="Users" value={12048} delta={4.1} trend={[50, 45, 60, 62, 70]} hint="active" />
                  <KpiCard label="Churn" value={6.2} delta={-1.8} trend={[70, 66, 64, 60, 58]} hint="monthly" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Card padding="lg">
                    <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">Weekly signups</p>
                    <BarChart
                      height={110}
                      data={[
                        { label: "M", value: 24 },
                        { label: "T", value: 42 },
                        { label: "W", value: 31 },
                        { label: "T", value: 55 },
                        { label: "F", value: 47 },
                      ]}
                    />
                  </Card>
                  <Card padding="lg" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Goal completion</span>
                      <Badge variant="success" dot>on track</Badge>
                    </div>
                    <Progress value={72} />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-surface-700">
                        <Switch defaultChecked /> Auto-alerts
                      </label>
                      <Input placeholder="you@acme.dev" className="max-w-40" defaultValue="ops@acme.dev" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center font-mono text-[11px] text-surface-400">
              live preview — real components · hue / radius / elevation write CSS variables, no reload
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function cnChip(active: boolean) {
  return [
    "rounded-lg py-1.5 text-xs font-medium transition-colors",
    active ? "bg-brand-600 text-white shadow-soft" : "bg-surface-100 text-surface-500 hover:bg-surface-200",
  ].join(" ");
}