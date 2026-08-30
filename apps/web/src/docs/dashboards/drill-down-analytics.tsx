import { useState } from "react";
import { Badge, Button } from "@vaultui/ui";
import { AnimatedCounter, Sparkline, TreeMap, WaterfallChart } from "@vaultui/data-viz";
import { cn } from "@vaultui/utils";
import { ArrowRight, ChevronDown, ChevronRight, FolderOpen, ZoomIn } from "lucide-react";

/**
 * Drill-Down Analytics — uistyleguide.com style: hierarchical exploration.
 * Big picture, then progressive disclosure — expandable tree rows,
 * breadcrumb navigation, zoom transitions, linked highlighting and filter
 * animations. Light theme (#FFFFFF / #1F2937 / #6366F1). Built 100% from
 * Vault tokens so Neumorphic / Glassmorphism / Dimensional Layering /
 * Vintage Retro Film re-skin every panel.
 */

interface Row {
  id: string;
  name: string;
  /** Revenue, k$. */
  revenue: number;
  /** % change. */
  delta: number;
  units: number;
  /** Margin %. */
  margin: number;
  trend: number[];
  children?: Row[];
}

const CATEGORIES: Row[] = [
  {
    id: "audio", name: "Audio & Speakers", revenue: 1284, delta: 12.4, units: 84210, margin: 42,
    trend: [22, 24, 26, 28, 31, 34, 38, 42], children: [
      { id: "a1", name: "Headphones", revenue: 612, delta: 18.2, units: 38900, margin: 46, trend: [20, 24, 27, 30, 34, 39, 44, 50] },
      { id: "a2", name: "Earbuds", revenue: 348, delta: 9.1, units: 26100, margin: 38, trend: [18, 19, 21, 24, 26, 29, 31, 34] },
      { id: "a3", name: "Speakers", revenue: 214, delta: -3.4, units: 11200, margin: 35, trend: [30, 28, 27, 26, 24, 23, 22, 21] },
      { id: "a4", name: "Amplifiers", revenue: 110, delta: 4.7, units: 8010, margin: 41, trend: [11, 12, 11, 13, 12, 13, 14, 15] },
    ],
  },
  {
    id: "smart-home", name: "Smart Home", revenue: 1210, delta: 21.8, units: 51300, margin: 47,
    trend: [16, 18, 21, 24, 28, 33, 39, 46], children: [
      { id: "h1", name: "Cameras", revenue: 512, delta: 26.4, units: 21400, margin: 51, trend: [14, 17, 21, 26, 31, 37, 44, 52] },
      { id: "h2", name: "Hubs", revenue: 403, delta: 19.2, units: 15800, margin: 44, trend: [15, 17, 18, 21, 24, 27, 30, 35] },
      { id: "h3", name: "Lighting", revenue: 295, delta: 14.7, units: 14100, margin: 40, trend: [13, 15, 16, 18, 20, 22, 24, 27] },
    ],
  },
  {
    id: "computing", name: "Computing", revenue: 1564, delta: 6.3, units: 33400, margin: 34,
    trend: [24, 25, 27, 26, 29, 28, 31, 32], children: [
      { id: "c1", name: "Laptops", revenue: 812, delta: 8.9, units: 12900, margin: 32, trend: [21, 23, 25, 24, 27, 29, 30, 33] },
      { id: "c2", name: "Desktops", revenue: 472, delta: -1.8, units: 9800, margin: 36, trend: [27, 26, 25, 24, 23, 23, 22, 22] },
      { id: "c3", name: "Peripherals", revenue: 280, delta: 11.2, units: 10700, margin: 38, trend: [12, 13, 15, 14, 17, 18, 20, 22] },
    ],
  },
  {
    id: "wearables", name: "Wearables", revenue: 842, delta: 15.6, units: 46700, margin: 44,
    trend: [14, 16, 18, 21, 24, 28, 32, 37], children: [
      { id: "w1", name: "Smartwatches", revenue: 468, delta: 17.9, units: 22100, margin: 46, trend: [13, 15, 18, 21, 24, 28, 32, 37] },
      { id: "w2", name: "Fitness trackers", revenue: 251, delta: 12.8, units: 18700, margin: 42, trend: [14, 15, 16, 17, 19, 21, 23, 26] },
      { id: "w3", name: "Smart rings", revenue: 123, delta: 24.1, units: 5900, margin: 48, trend: [6, 8, 11, 14, 17, 20, 24, 29] },
    ],
  },
  {
    id: "mobile", name: "Mobile Accessories", revenue: 673, delta: 4.1, units: 79200, margin: 37,
    trend: [26, 27, 26, 28, 27, 29, 28, 30], children: [
      { id: "m1", name: "Cases", revenue: 289, delta: 3.2, units: 41100, margin: 35, trend: [24, 25, 24, 26, 25, 27, 26, 28] },
      { id: "m2", name: "Chargers", revenue: 244, delta: 7.6, units: 25900, margin: 40, trend: [17, 18, 19, 20, 21, 22, 23, 25] },
      { id: "m3", name: "Mounts", revenue: 140, delta: -2.9, units: 12200, margin: 33, trend: [21, 20, 20, 19, 18, 17, 17, 16] },
    ],
  },
];

const REGION_SHARE: Record<string, Record<string, number>> = {
  audio: { US: 0.42, EU: 0.31, APAC: 0.27 },
  "smart-home": { US: 0.51, EU: 0.24, APAC: 0.25 },
  computing: { US: 0.55, EU: 0.2, APAC: 0.25 },
  wearables: { US: 0.38, EU: 0.27, APAC: 0.35 },
  mobile: { US: 0.33, EU: 0.3, APAC: 0.37 },
};

const REGIONS = ["All", "US", "EU", "APAC"] as const;

/** Lookup a row anywhere in the tree. */
function findRow(id: string, rows: Row[] = CATEGORIES): Row | undefined {
  for (const r of rows) {
    if (r.id === id) return r;
    const hit = r.children ? findRow(id, r.children) : undefined;
    if (hit) return hit;
  }
  return undefined;
}

const trailTime = () =>
  new Date().toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit" });

/* ------------------------------- component ------------------------------- */

export function DrillDownAnalyticsDemo() {
  const [path, setPath] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState("audio");
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [trail, setTrail] = useState<{ id: number; action: string; time: string }[]>([
    { id: 1, action: "Opened revenue explorer", time: "09:41" },
  ]);

  const level = path.length;
  const parentId = path[level - 1];
  const levelRows = level === 0 ? CATEGORIES : findRow(parentId ?? "")?.children ?? [];
  const scale = region === "All" ? 1 : REGION_SHARE[parentId ?? levelRows[0]?.id ?? ""]?.[region] ?? 1;

  const selectedRow = findRow(selected) ?? levelRows[0]!;

  /** Breadcrumb "zoom transition" + audit trail. */
  const zoomTo = (nextPath: string[], note: string) => {
    setPath(nextPath);
    setExpanded([]);
    setTrail((t) => [{ id: Date.now(), action: note, time: trailTime() }, ...t].slice(0, 6));
  };

  const drillInto = (row: Row) => {
    setSelected(row.id);
    setPath([row.id]);
    setExpanded([]);
    setTrail((t) => [{ id: Date.now(), action: `Zoom in → ${row.name}`, time: trailTime() }, ...t].slice(0, 6));
  };

  const toggleRow = (row: Row) => {
    setSelected(row.id);
    setExpanded((e) => (e.includes(row.id) ? e.filter((x) => x !== row.id) : [...e, row.id]));
  };

  /** Linked chart — waterfall bridge of the current level (zooms with the breadcrumb). */
  const bridge = (() => {
    const deltas = levelRows.map((r) => ({ label: r.name, value: r.revenue * scale, type: "delta" as const }));
    const total = deltas.reduce((a, d) => a + d.value, 0);
    return [...deltas, { label: "Total", value: total, type: "total" as const }];
  })();

  const crumbs = [{ id: "home", label: "Home", next: [] as string[] }, ...path.map((id) => ({
    id,
    label: findRow(id)?.name ?? id,
    next: path.slice(0, path.indexOf(id) + 1),
  }))];

  return (
    <div className="bg-surface-50">
      {/* Header + filter (linked filtering) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 bg-surface-0 px-4 py-3 sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold tracking-tight text-surface-900">Drill-Down Analytics</p>
            <Badge variant="brand" size="sm" dot>linked views</Badge>
          </div>
          <p className="mt-0.5 text-xs text-surface-400">Revenue explorer · Q3 FY25 · region-filtered</p>
        </div>

        {/* Filter animations */}
        <div className="flex items-center rounded-lg bg-surface-100 p-0.5 shadow-inset">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRegion(r);
                setTrail((t) => [{ id: Date.now(), action: `Filter → ${r}`, time: trailTime() }, ...t].slice(0, 6));
              }}
              className={cn(
                "h-7 rounded-md px-2.5 text-xs font-medium transition-colors",
                region === r ? "bg-surface-0 text-surface-900 shadow-soft" : "text-surface-500 hover:text-surface-800",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 pt-4 text-sm sm:px-6">
        {crumbs.map((c, i) => (
          <span key={c.id} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-surface-400" />}
            {i < crumbs.length - 1 ? (
              <button
                type="button"
                onClick={() => zoomTo(c.next, `Zoom out → ${c.label}`)}
                className={cn(
                  "rounded-md px-1.5 py-0.5 font-medium transition-colors",
                  i === 0 ? "text-surface-500 hover:bg-surface-100 hover:text-surface-800" : "text-brand-600 hover:bg-brand-50",
                )}
              >
                {c.label}
              </button>
            ) : (
              <span className="rounded-md bg-surface-100 px-1.5 py-0.5 font-semibold text-surface-800">{c.label}</span>
            )}
          </span>
        ))}
        <span className="ml-auto hidden font-mono text-[11px] text-surface-400 sm:block">
          level {level + 1} of 2
        </span>
      </div>

      {/* Main: explorer + linked details */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:px-6 lg:grid-cols-3">
        {/* Hierarchy explorer — big picture + expandable rows (zoom transition on drill) */}
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Hierarchy explorer</p>
              <Badge variant="neutral" size="sm">{levelRows.length} rows</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => zoomTo([], "Reset to big picture")}>
              Reset view
            </Button>
          </div>

          {/* Big picture */}
          <p className="mt-3 text-xs text-surface-400">Share of revenue · click rows below to drill</p>
          <div className="mt-1">
            <TreeMap
              items={CATEGORIES.map((c) => ({ id: c.id, label: c.name, value: c.revenue }))}
              heightClass="h-48"
            />
          </div>

          {/* Expandable rows — keyed by view + region for the filter animation */}
          <div key={`${path.join("/")}-${region}`} className="mt-4 animate-rise">
            {levelRows.map((row) => (
              <div key={row.id}>
                <TreeRow
                  row={row}
                  depth={0}
                  scale={scale}
                  selected={selected === row.id}
                  expanded={expanded.includes(row.id)}
                  onSelect={() => setSelected(row.id)}
                  onToggle={() => toggleRow(row)}
                  onDrill={() => drillInto(row)}
                />
                {expanded.includes(row.id) &&
                  row.children?.map((child) => (
                    <TreeRow
                      key={child.id}
                      row={child}
                      depth={1}
                      scale={scale}
                      selected={selected === child.id}
                      expanded={false}
                      onSelect={() => setSelected(child.id)}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Selection details — linked highlighting */}
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-500" />
            <p className="text-sm font-semibold text-surface-800">Selection details</p>
          </div>

          <div key={selectedRow.id + region} className="mt-3 animate-rise">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-bold tracking-tight text-surface-900">{selectedRow.name}</p>
              <Badge variant={selectedRow.delta >= 0 ? "success" : "danger"} size="sm">
                {selectedRow.delta >= 0 ? "▲" : "▼"} {Math.abs(selectedRow.delta).toFixed(1)}%
              </Badge>
            </div>

            <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-brand-600">
              $<AnimatedCounter value={selectedRow.revenue * scale} format={(n) => `${Math.round(n).toLocaleString()}k`} />
            </p>
            <p className="text-[11px] text-surface-400">revenue · {region} region</p>

            <div className="mt-4">
              <Sparkline data={selectedRow.trend} colorClass="text-brand-600" fill className="h-16 w-full" />
            </div>

            <dl className="mt-4 space-y-2.5">
              <Stat label="Units sold" value={Math.round(selectedRow.units * scale).toLocaleString()} />
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500">Margin</span>
                  <span className="font-mono text-surface-700">{selectedRow.margin}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-200">
                  <div className="h-full rounded-full bg-success-500" style={{ width: `${selectedRow.margin}%` }} />
                </div>
              </div>
            </dl>

            {/* Channel split — linked bars */}
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-surface-400">Channel split</p>
            <div className="mt-2 space-y-2">
              {[
                { label: "Direct", pct: 42, cls: "bg-brand-600" },
                { label: "Marketplace", pct: 35, cls: "bg-brand-400" },
                { label: "Retail", pct: 23, cls: "bg-info-500" },
              ].map((ch) => (
                <div key={ch.label} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-xs text-surface-500">{ch.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-200">
                    <div className={cn("h-full rounded-full", ch.cls)} style={{ width: `${ch.pct}%` }} />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono text-[11px] text-surface-600">{ch.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: linked waterfall + drill trail */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 sm:px-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ZoomIn className="size-4 text-brand-600" />
              <p className="text-sm font-semibold text-surface-800">Revenue bridge</p>
              <Badge variant="neutral" size="sm">{crumbs[crumbs.length - 1]!.label}</Badge>
            </div>
            <span className="font-mono text-[11px] text-surface-400">follows the drilled level</span>
          </div>
          <div className="mt-3">
            <WaterfallChart
              steps={bridge}
              format={(n) => `$${Math.round(n)}k`}
              className="h-52"
            />
          </div>
          <p className="mt-2 text-[11px] text-surface-400">
            Deltas ladder the current level's rows; the total bar anchors at zero. Selecting a row and
            drilling keeps the breadcrumb, trail and bridge in sync.
          </p>
        </div>

        {/* Drill trail — audit log of the exploration */}
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-surface-800">Drill trail</p>
            <Badge variant="brand" size="sm">audit</Badge>
          </div>
          <ol className="mt-3 space-y-1.5">
            {trail.map((t) => (
              <li key={t.id} className="flex items-center gap-2 rounded-lg bg-surface-50 px-2.5 py-2">
                <ArrowRight className="size-3.5 shrink-0 text-brand-600" />
                <span className="min-w-0 flex-1 truncate text-[13px] text-surface-700">{t.action}</span>
                <code className="font-mono text-[10px] text-surface-400">{t.time}</code>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] leading-relaxed text-surface-400">
            Every zoom, filter and reset is recorded here — trace exactly how you got to the detail.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- sub-components ------------------------------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-surface-500">{label}</span>
      <span className="font-mono text-surface-700">{value}</span>
    </div>
  );
}

function TreeRow({
  row,
  depth,
  scale,
  selected,
  expanded,
  onSelect,
  onToggle,
  onDrill,
}: {
  row: Row;
  depth: number;
  scale: number;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggle?: () => void;
  onDrill?: () => void;
}) {
  const hasChildren = !!row.children?.length;
  const revenue = Math.round(row.revenue * scale);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 transition-colors",
        depth > 0 && "ml-6 w-[calc(100%-1.5rem)]",
        selected
          ? "border-brand-200 bg-brand-50"
          : "border-transparent hover:border-surface-200 hover:bg-surface-50",
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.();
        }}
        aria-label={expanded ? "Collapse row" : "Expand row"}
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-md transition-colors",
          hasChildren ? "text-surface-500 hover:bg-surface-200/60 hover:text-surface-800" : "invisible",
        )}
      >
        <ChevronDown className={cn("size-4 transition-transform", (expanded || !hasChildren) && "-rotate-90")} />
      </button>

      <span className={cn("min-w-0 flex-1 truncate text-[13px] font-medium", depth > 0 ? "text-surface-500" : "text-surface-800")}>
        {row.name}
      </span>
      {depth === 0 && (
        <span className={cn("hidden font-mono text-[11px] sm:block", row.delta >= 0 ? "text-success-500" : "text-danger-500")}>
          {row.delta >= 0 ? "▲" : "▼"} {Math.abs(row.delta).toFixed(1)}%
        </span>
      )}
      <span className="hidden w-14 text-right font-mono text-xs font-semibold tabular-nums text-surface-700 md:block">
        ${revenue.toLocaleString()}k
      </span>
      <span className="hidden w-16 lg:block">
        <Sparkline data={row.trend} colorClass="text-brand-500" fill={false} className="h-5 w-full" />
      </span>
      {hasChildren && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDrill?.();
          }}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-surface-100 px-1.5 py-1 text-[11px] font-medium text-surface-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-brand-50 hover:text-brand-700"
        >
          explore <ZoomIn className="size-3" />
        </button>
      )}
    </div>
  );
}