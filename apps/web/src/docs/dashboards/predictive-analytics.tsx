import { useState } from "react";
import { Badge } from "@vaultui/ui";
import { ProgressRadial, Sparkline } from "@vaultui/data-viz";
import { cn } from "@vaultui/utils";
import { Brain, Sparkles } from "lucide-react";

/**
 * Predictive Analytics — uistyleguide.com style: what the data says about
 * the future. Animated forecast lines, confidence bands, scenario toggles
 * and prediction badges (#1E1B4B / #FFFFFF / #8B5CF6 palette). Built with
 * Vault tokens only, so Neumorphic / Glassmorphism / Dimensional Layering /
 * Vintage Retro Film re-skin every panel, chart and badge.
 *
 * The forecast chart is a custom SVG on token colors: solid history line,
 * dashed projection, a widening confidence band and a "today" marker —
 * the 3 scenario buttons re-scale the projection live.
 */

/* --------------------------------- data ---------------------------------- */

/** Historical demand, $10k units (8 months). */
const HISTORY = [22, 24, 27, 29, 31, 34, 38, 43];
/** Base-case projection, $10k units (4 months). */
const FORECAST_BASE = [48, 54, 62, 71];
/** Confidence band half-widths around the base projection (widens with horizon). */
const BAND = [5, 7, 10, 14];

const SCENARIOS = [
  { id: "base", label: "Base", mult: 1.0, prob: "P50" },
  { id: "optimistic", label: "Optimistic", mult: 1.18, prob: "P30" },
  { id: "conservative", label: "Conservative", mult: 0.91, prob: "P80" },
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SIGNALS = [
  { label: "Seasonality · Q4 uplift", tone: "success" as const, note: "strong" },
  { label: "Price elasticity", tone: "info" as const, note: "stable" },
  { label: "Churn risk", tone: "success" as const, note: "low" },
  { label: "Supply lead time", tone: "warning" as const, note: "rising" },
];

const SEGMENTS = [
  { name: "Smart Home", run: [16, 18, 21, 24, 28, 33, 39, 46, 52, 60], pred: "$1.42M", conf: 94, up: 21.8 },
  { name: "Audio", run: [22, 24, 26, 28, 31, 34, 38, 42, 47, 52], pred: "$1.36M", conf: 91, up: 12.4 },
  { name: "Computing", run: [24, 25, 27, 26, 29, 28, 31, 32, 34, 36], pred: "$1.21M", conf: 87, up: 6.3 },
  { name: "Wearables", run: [14, 16, 18, 21, 24, 28, 32, 37, 41, 46], pred: "$0.98M", conf: 84, up: 15.6 },
  { name: "Mobile Accessories", run: [26, 27, 26, 28, 27, 29, 28, 30, 31, 33], pred: "$0.74M", conf: 79, up: 4.1 },
];

const SCENARIO_IMPACT = [
  { id: "s1", name: "Base", prob: "P50 · 45%", pct: 0, cls: "bg-brand-500", tone: "neutral" as const },
  { id: "s2", name: "Optimistic", prob: "P30 · 30%", pct: 18, cls: "bg-success-500", tone: "success" as const },
  { id: "s3", name: "Conservative", prob: "P80 · 25%", pct: -9, cls: "bg-warning-500", tone: "warning" as const },
];

/* ----------------------------- forecast chart ---------------------------- */

const W = 320;
const H = 150;
const PAD = { top: 14, right: 10, bottom: 22, left: 10 };
const POINTS = HISTORY.length + FORECAST_BASE.length; // 12
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;
const x = (i: number) => PAD.left + (i / (POINTS - 1)) * plotW;
const y = (v: number, max: number, min: number) => PAD.top + ((max - v) / (max - min || 1)) * plotH;

function ForecastChart({ mult }: { mult: number }) {
  const forecast = FORECAST_BASE.map((v) => v * mult);
  const values = [...HISTORY, ...forecast];
  const all = [...values, ...values.map((v) => v + 18)];
  const max = Math.max(...all) + 6;
  const min = Math.max(0, Math.min(...values) - 10);

  const histLine = HISTORY.map((v, i) => `${x(i).toFixed(1)},${y(v, max, min).toFixed(1)}`).join(" ");
  const histArea = `${x(0).toFixed(1)},${y(0, max, min).toFixed(1)} ${histLine} ${x(HISTORY.length - 1).toFixed(1)},${y(0, max, min).toFixed(1)}`;

  const today = x(HISTORY.length - 1);
  const lastHistX = x(HISTORY.length - 1);

  const bandUp = forecast.map((v, i) => [x(HISTORY.length + i), y(v + BAND[i]! * mult, max, min)] as const);
  const bandLo = [...forecast].reverse().map((v, i) => {
    const idx = forecast.length - 1 - i;
    return [x(HISTORY.length + idx), y(v - BAND[idx]! * mult, max, min)] as const;
  });
  const bandPath = [
    ...bandUp, ...bandLo,
  ].map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");

  const fcLine = forecast.map((v, i) => `${x(HISTORY.length + i).toFixed(1)},${y(v, max, min).toFixed(1)}`).join(" ");
  const last = forecast[forecast.length - 1]!;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Demand forecast with confidence band" preserveAspectRatio="none">
      {/* gridlines */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={PAD.left}
          x2={W - PAD.right}
          y1={PAD.top + plotH * f}
          y2={PAD.top + plotH * f}
          stroke="currentColor"
          strokeOpacity="0.08"
        />
      ))}

      {/* confidence band */}
      <polygon points={bandPath} className="fill-brand-400" fillOpacity={0.12} />
      {/* history fill + line */}
      <polygon points={histArea} className="fill-brand-600" fillOpacity={0.06} />
      <polyline points={histLine} fill="none" className="stroke-brand-600" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* today marker */}
      <line x1={today} x2={today} y1={PAD.top} y2={H - PAD.bottom} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="3 3" />
      <text x={lastHistX + 2} y={PAD.top - 1} fontSize="7" fill="currentColor" fillOpacity="0.55">today</text>
      {/* forecast projection */}
      <polyline points={fcLine} fill="none" className="stroke-brand-500" strokeWidth={2} strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(POINTS - 1)} cy={y(last, max, min)} r={3} className="fill-brand-500" />
      {/* month labels */}
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 7} fontSize="7" textAnchor="middle" fill="currentColor" fillOpacity="0.5">
          {i % 2 === 0 ? m : ""}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------- component ------------------------------- */

export function PredictiveAnalyticsDemo() {
  const [scenario, setScenario] = useState<(typeof SCENARIOS)[number]>(SCENARIOS[0]!);
  const forecastSum = FORECAST_BASE.reduce((a, v) => a + v * scenario.mult, 0);
  const outlook = `$${(forecastSum * 0.01).toFixed(2)}M`;

  return (
    <div className="bg-surface-50">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 bg-surface-0 px-4 py-3 sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold tracking-tight text-surface-900">Predictive Analytics</p>
            <Badge variant="success" size="sm" dot>model healthy</Badge>
          </div>
          <p className="mt-0.5 text-xs text-surface-400">Q4 demand forecast · gradient boosting v2.4 · trained 02:00</p>
        </div>
        <div className="flex items-center gap-2">
          <code className="rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-1.5 font-mono text-xs text-surface-700 shadow-inset">
            2.1M rows · refresh 6h
          </code>
          <Badge variant="brand" size="sm">
            <Brain className="mr-1 size-3" /> ML output
          </Badge>
        </div>
      </div>

      {/* Forecast + outlook */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:px-6 lg:grid-cols-3">
        {/* Forecast chart with confidence band */}
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Demand forecast</p>
              <Badge variant="neutral" size="sm">next 4 months</Badge>
            </div>

            {/* Scenario toggles — re-projects the forecast live */}
            <div className="flex items-center rounded-lg bg-surface-100 p-0.5 shadow-inset">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScenario(s)}
                  className={cn(
                    "h-7 rounded-md px-2.5 text-xs font-medium transition-colors",
                    scenario.id === s.id
                      ? "bg-surface-0 text-surface-900 shadow-soft"
                      : "text-surface-500 hover:text-surface-800",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animated re-mount on scenario change */}
          <div key={scenario.id} className="mt-4 animate-rise">
            <ForecastChart mult={scenario.mult} />
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-surface-500">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded bg-brand-600" /> historical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded bg-brand-400" /> forecast
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-brand-400 opacity-30" /> confidence band
            </span>
            <span className="font-mono text-surface-400">{scenario.prob} · {scenario.label.toLowerCase()}</span>
          </div>
        </div>

        {/* Right rail — prediction indicators */}
        <div className="space-y-3">
          {/* Outlook + confidence */}
          <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
            <p className="text-sm font-semibold text-surface-800">Q4 revenue outlook</p>
            <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-brand-600">{outlook}</p>
            <p className="mt-0.5 text-[11px] text-surface-400">
              {scenario.label} scenario · ± $0.14M · P10–P90
            </p>
            <div className="mt-4 flex items-center gap-4">
              <ProgressRadial value={73} tone="brand" size={84} stroke={8} label="73%" sublabel="confidence" />
              <div className="space-y-1.5">
                <p className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-surface-500">Best case</span>
                  <span className="font-mono font-semibold text-success-500">${(FORECAST_BASE.reduce((a, v) => a + v * SCENARIOS[1]!.mult, 0) * 0.01).toFixed(2)}M</span>
                </p>
                <p className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-surface-500">Worst case</span>
                  <span className="font-mono font-semibold text-warning-500">${(FORECAST_BASE.reduce((a, v) => a + v * SCENARIOS[2]!.mult, 0) * 0.01).toFixed(2)}M</span>
                </p>
                <p className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-surface-500">Model MAE</span>
                  <span className="font-mono font-semibold text-surface-700">± 6.4%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Model signals */}
          <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Model signals</p>
            </div>
            <ul className="mt-3 space-y-1.5">
              {SIGNALS.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-2 rounded-lg bg-surface-50 px-2.5 py-2">
                  <span className="text-[13px] text-surface-700">{s.label}</span>
                  <Badge variant={s.tone} size="sm" dot>{s.note}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Segments + scenario impact */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 sm:px-6 lg:grid-cols-3">
        {/* Integrated forecast per segment */}
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-surface-800">Forecast by segment</p>
            <Badge variant="neutral" size="sm">run-rate → prediction</Badge>
          </div>
          <ul className="mt-3 space-y-1.5">
            {SEGMENTS.map((s) => (
              <li key={s.name} className="flex items-center gap-3 rounded-xl border border-surface-100 bg-surface-50 px-3 py-2.5">
                <span className="w-36 shrink-0 truncate text-[13px] font-medium text-surface-800 sm:w-40">{s.name}</span>
                <span className="hidden w-14 shrink-0 font-mono text-[11px] text-success-500 md:block">▲ {s.up}%</span>
                <span className="hidden w-20 shrink-0 sm:block">
                  <Sparkline data={s.run} colorClass="text-brand-500" fill={false} className="h-5 w-full" />
                </span>
                <span className="ml-auto shrink-0 font-mono text-sm font-semibold tabular-nums text-surface-900">{s.pred}</span>
                <Badge variant="brand" size="sm">{s.conf}% conf</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-surface-400">
            Each segment shows its trailing run-rate, direction, predicted Q4 revenue and the model's
            prediction confidence — the deeper the history, the tighter the band.
          </p>
        </div>

        {/* Scenario impact — risk assessment */}
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
          <p className="text-sm font-semibold text-surface-800">Scenario impact</p>
          <p className="mt-0.5 text-[11px] text-surface-400">vs base · Q4 demand</p>
          <div className="mt-4 space-y-3">
            {SCENARIO_IMPACT.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-surface-700">{s.name}</span>
                    <Badge variant={s.tone} size="sm">{s.prob}</Badge>
                  </span>
                  <span className={cn("font-mono", s.pct >= 0 ? "text-success-500" : "text-danger-500")}>
                    {s.pct >= 0 ? "+" : ""}{s.pct}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-200">
                  <div
                    className={cn("h-full rounded-full", s.cls)}
                    style={{ width: `${Math.max(8, Math.min(96, 50 + s.pct * 2))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2.5 text-[11px] leading-relaxed text-brand-700">
            What-if: the optimistic path adds ≈ $0.42M to Q4; the conservative band risks −$0.21M.
            Capacity plan against the P50 with P80 headroom.
          </p>
        </div>
      </div>
    </div>
  );
}