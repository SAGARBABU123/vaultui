import { useState } from "react";
import { Badge, Button, Card } from "@vaultui/ui";
import {
  HeatmapCalendar,
  KpiCard,
  ProgressRadial,
  Sparkline,
} from "@vaultui/data-viz";
import { LogStream, type LogEntry } from "@vaultui/dev-tools";
import { RoadmapTimeline, type RoadmapItem } from "@vaultui/project";
import { cn } from "@vaultui/utils";
import { Activity, FileText, RefreshCw, Target, TrendingUp } from "lucide-react";

/**
 * Executive Dashboard — uistyleguide.com "Executive Dashboard" style:
 * large KPI numbers, trend arrows, simple charts, donut gauge, drill-down
 * buttons and refresh animations. Built 100% from Vault theme tokens
 * (bg-surface-*, text-*, border-*, shadow-*, brand-*, success-*, …) so the
 * active theme — Neumorphic, Glassmorphism, Dimensional Layering or Vintage
 * Retro Film — re-skins the whole template instantly.
 */

/* --------------------------------- data ---------------------------------- */

const REVENUE_TREND = [
  21, 24, 23, 27, 26, 29, 28, 32, 31, 34, 33, 37, 36, 40, 39, 43, 42, 46, 45,
  44, 48, 47, 51, 50, 54, 53, 57, 56, 55, 59, 58, 62,
];
const CUSTOMER_TREND = [5.1, 5.4, 5.3, 5.7, 5.6, 6.0, 5.9, 6.3, 6.2, 6.6, 6.5, 6.9];
const CONVERSION_TREND = [2.8, 2.9, 3.0, 2.9, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6];
const CHURN_TREND = [1.9, 1.8, 1.8, 1.7, 1.6, 1.6, 1.5, 1.4, 1.3, 1.2];

/** Board activity — 10 weeks x 7 days, GitHub-style (0–5). */
const ACTIVITY = [
  [1, 3, 2, 4, 3, 5, 1],
  [2, 3, 4, 3, 5, 4, 2],
  [1, 2, 3, 4, 4, 5, 1],
  [3, 4, 3, 5, 4, 5, 2],
  [2, 3, 4, 4, 5, 4, 1],
  [3, 4, 5, 4, 5, 5, 2],
  [2, 3, 4, 5, 4, 5, 1],
  [1, 3, 4, 3, 4, 5, 2],
  [2, 4, 3, 5, 4, 5, 1],
  [3, 4, 5, 4, 5, 5, 2],
].flat();

/** Q4 boarding window — indices run Oct (0) → Sep (11). */
const QUARTER_MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const ROADMAP_Q4: RoadmapItem[] = [
  { id: "b1", name: "Analytics migration", start: 0, end: 2, color: "brand", status: "in-progress", milestone: true },
  { id: "b2", name: "Executive board rollout", start: 0, end: 3, color: "success", status: "in-progress" },
  { id: "b3", name: "Cost optimization", start: 1, end: 3, color: "warning", status: "planned" },
  { id: "b4", name: "Board review", start: 2, end: 3, color: "danger", status: "planned", milestone: true },
];

const BOARD_EVENTS: LogEntry[] = [
  { id: "e1", level: "info", message: "Q3 board report generated", timestamp: "09:41" },
  { id: "e2", level: "info", message: "Enterprise onboarding complete · Northwind", timestamp: "09:12" },
  { id: "e3", level: "warn", message: "Cash runway below 12-month threshold", timestamp: "08:52", payload: { runway: "9.4 mo" } },
  { id: "e4", level: "error", message: "Stripe payout sync failed — retrying", timestamp: "08:31" },
  { id: "e5", level: "debug", message: "Board metrics refreshed (cache TTL 5m)", timestamp: "08:15" },
  { id: "e6", level: "info", message: "Q3 CFO summary signed off", timestamp: "07:58" },
];

const GOALS = [
  { label: "Net margin", pct: 42, cls: "bg-brand-500" },
  { label: "Pipeline coverage", pct: 64, cls: "bg-info-500" },
  { label: "Cost discipline", pct: 88, cls: "bg-success-500" },
];

/* ------------------------------- component ------------------------------- */

export function ExecutiveDashboardDemo() {
  const [tick, setTick] = useState(0);
  const [period, setPeriod] = useState("Quarter");
  const periods = ["Week", "Month", "Quarter"];

  return (
    <div className="bg-surface-50">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 bg-surface-0 px-4 py-3 sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold tracking-tight text-surface-900">Executive Overview</p>
            <Badge variant="success" size="sm" dot>
              All systems nominal
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-surface-400">Board summary · refreshed 09:41 · Q3 FY25</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg bg-surface-100 p-0.5 shadow-inset">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "h-7 rounded-md px-2.5 text-xs font-medium transition-colors",
                  period === p ? "bg-surface-0 text-surface-900 shadow-soft" : "text-surface-500 hover:text-surface-800",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => setTick((t) => t + 1)} leadingIcon={<RefreshCw className="size-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI row — large numbers, trend arrows, animated counters */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <KpiCard
          key={`rev-${tick}`}
          label="Revenue"
          value={2489000}
          delta={12.4}
          format={(n) => `$${(n / 1e6).toFixed(2)}M`}
          trend={REVENUE_TREND}
          hint="vs last quarter"
        />
        <KpiCard
          key={`cust-${tick}`}
          label="Active customers"
          value={8431}
          delta={4.2}
          format={(n) => n.toLocaleString()}
          trend={CUSTOMER_TREND}
          hint="+342 net this month"
        />
        <KpiCard
          key={`conv-${tick}`}
          label="Conversion"
          value={3.6}
          delta={0.8}
          format={(n) => `${n.toFixed(1)}%`}
          trend={CONVERSION_TREND}
          hint="best in six months"
        />
        <KpiCard
          key={`churn-${tick}`}
          label="Churn"
          value={1.2}
          delta={-0.3}
          format={(n) => `${n.toFixed(1)}%`}
          trend={CHURN_TREND}
          hint="lower is better"
        />
      </div>

      {/* Mid row — main chart + goal donut */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-3 sm:px-6 lg:grid-cols-3">
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Revenue performance</p>
              <Badge variant="neutral" size="sm">Q3 · weekly</Badge>
            </div>
            <Button variant="ghost" size="sm">
              View report
            </Button>
          </div>

          <p className="mt-4 text-xs text-surface-400">Net revenue · trailing 32 weeks</p>
          <Sparkline data={REVENUE_TREND} colorClass="text-brand-600" fill className="mt-1 h-40 w-full" />

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-surface-100 pt-4 text-center">
            <div>
              <p className="font-mono text-lg font-bold text-surface-900">$2.49M</p>
              <p className="text-[11px] text-surface-400">this quarter</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-brand-600">78%</p>
              <p className="text-[11px] text-surface-400">of $3.0M target</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-surface-900">$2.87M</p>
              <p className="text-[11px] text-surface-400">forecast · 30d</p>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Goal attainment</p>
            </div>
            <Badge variant="success" size="sm" dot>
              On track
            </Badge>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4">
            <ProgressRadial value={78} tone="brand" size={132} stroke={12} label="78%" sublabel="annual target" />
          </div>

          <div className="space-y-3 border-t border-surface-100 pt-4">
            {GOALS.map((g) => (
              <div key={g.label} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-surface-500">{g.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-200">
                  <div className={cn("h-full rounded-full", g.cls)} style={{ width: `${g.pct}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right font-mono text-xs text-surface-600">{g.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row — activity, roadmap, audit feed */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 sm:px-6 lg:grid-cols-3">
        <Card padding="lg">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Board activity</p>
            </div>
            <Badge variant="neutral" size="sm">10 weeks</Badge>
          </div>
          <div className="mt-4">
            <HeatmapCalendar values={ACTIVITY} max={5} weeks={10} monthEvery={5} />
          </div>
          <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-surface-400">
            Less
            {["bg-surface-100", "bg-brand-200", "bg-brand-400", "bg-brand-600", "bg-brand-800"].map((c) => (
              <span key={c} className={cn("size-2.5 rounded-[3px]", c)} />
            ))}
            More
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Q4 roadmap</p>
            </div>
            <Badge variant="brand" size="sm">Oct–Dec</Badge>
          </div>
          <div className="mt-5">
            <RoadmapTimeline items={ROADMAP_Q4} now={0} months={QUARTER_MONTHS} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-surface-400">
            Board priorities through the quarter — statuses and milestones are token-driven.
          </p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Recent events</p>
            </div>
            <Badge variant="neutral" size="sm" dot>
              audit feed
            </Badge>
          </div>
          <div className="mt-4">
            <LogStream entries={BOARD_EVENTS} heightClass="h-64" />
          </div>
        </Card>
      </div>
    </div>
  );
}