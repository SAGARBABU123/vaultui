import { useEffect, useState } from "react";
import { Badge, Button } from "@vaultui/ui";
import { AnimatedCounter, ProgressRadial, Sparkline } from "@vaultui/data-viz";
import { LogStream, type LogEntry } from "@vaultui/dev-tools";
import { cn } from "@vaultui/utils";
import { RefreshCw, ShieldAlert } from "lucide-react";

/**
 * Real-Time Monitoring — uistyleguide.com style: live data, streaming
 * charts, alert pulses and auto-refresh. Built 100% from Vault theme tokens
 * on the LIGHT surfaces (bg-surface-0/50, border-surface-200, shadow-soft,
 * text-surface-*), so Neumorphic / Glassmorphism / Dimensional Layering /
 * Vintage Retro Film each visibly re-skin every card. The dark token steps
 * survive only inside LogStream — an embedded terminal that reads as an
 * ops console in every theme.
 *
 * Everything updates for real: a ticking clock, streaming traffic chart,
 * drifting gauges, auto-refresh toggle and a live-appending event console.
 */

/* --------------------------------- data ---------------------------------- */

const BASE_TRAFFIC = [
  72, 81, 77, 90, 86, 95, 88, 102, 96, 110, 104, 99, 115, 108, 120, 112, 106,
  121, 114, 126, 118, 130, 122, 135, 127, 141, 132, 144, 138, 150, 146, 139,
  152, 148, 158, 150, 163, 155, 168, 160,
];

const BASE_EVENTS: LogEntry[] = [
  { id: "l0", level: "info", message: "Ops console attached to event stream", timestamp: "09:41:20" },
  { id: "l1", level: "info", message: "GET /api/v2/orders 200 in 34ms", timestamp: "09:41:12" },
  { id: "l2", level: "warn", message: "pg_pool latency breach > 45ms", timestamp: "09:40:58", payload: { pool: "reader-2", p50: "48ms" } },
  { id: "l3", level: "debug", message: "cache hit-rate 98.2% · ttl 30s", timestamp: "09:40:51" },
  { id: "l4", level: "error", message: "websocket reconnect · node eu-west-2a", timestamp: "09:40:39" },
  { id: "l5", level: "info", message: "auth0 token rotation complete", timestamp: "09:40:27" },
  { id: "l6", level: "debug", message: "kafka lag backfill ok · 0 behind", timestamp: "09:40:12" },
  { id: "l7", level: "info", message: "POST /api/v2/checkout 201 in 88ms", timestamp: "09:39:58" },
];

const EVENT_POOL = [
  { level: "info" as const, message: "GET /api/v2/orders 200 in 34ms" },
  { level: "info" as const, message: "POST /api/v2/events 204 in 12ms" },
  { level: "info" as const, message: "cache hit-rate 98.2% · ttl 30s" },
  { level: "debug" as const, message: "kafka lag backfill ok · 0 behind" },
  { level: "info" as const, message: "websocket keepalive · 42 clients" },
  { level: "warn" as const, message: "request throttled (rate limit 500/min)" },
  { level: "error" as const, message: "pg_pool latency breach > 45ms" },
];

const SERVICES = [
  { name: "API Gateway", state: "up", cls: "bg-success-500" },
  { name: "Database", state: "up", cls: "bg-success-500" },
  { name: "Workers", state: "up", cls: "bg-success-500" },
  { name: "CDN edge", state: "degraded", cls: "bg-warning-500" },
  { name: "Realtime feed", state: "up", cls: "bg-success-500" },
];

const OPEN_ALERTS = [
  { id: "a1", severity: "danger" as const, title: "P99 latency above SLO · eu-west-2a", time: "2m" },
  { id: "a2", severity: "warning" as const, title: "pg_pool connections at 82%", time: "8m" },
  { id: "a3", severity: "info" as const, title: "Deploy v2.14.0 rolled to 40%", time: "21m" },
];

/** HH:MM:SS for the console clock. */
const stamp = (d: Date) => d.toLocaleTimeString("en-GB", { hour12: false });

/* ------------------------------- component ------------------------------- */

export function RealtimeMonitoringDemo() {
  const [now, setNow] = useState(() => new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [traffic, setTraffic] = useState<number[]>(BASE_TRAFFIC);
  const [events, setEvents] = useState<LogEntry[]>(BASE_EVENTS);
  const [requests, setRequests] = useState(412);
  const [latency, setLatency] = useState(38);
  const [errorRate, setErrorRate] = useState(0.42);
  const [connections, setConnections] = useState(1204);
  const [cpu, setCpu] = useState(27);
  const [memory, setMemory] = useState(61);
  const [load, setLoad] = useState(74);

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => {
      setTraffic((prev) => [...prev.slice(-59), 60 + Math.round(Math.random() * 120)]);
      setRequests((r) => r + Math.round(Math.random() * 24));
      setLatency(() => 32 + Math.round(Math.random() * 14));
      setErrorRate(() => +(0.3 + Math.random() * 0.35).toFixed(2));
      setConnections((c) => c + Math.round((Math.random() - 0.5) * 40));
      setCpu(() => 22 + Math.round(Math.random() * 10));
      setMemory(() => 58 + Math.round(Math.random() * 6));
      setLoad(() => 70 + Math.round(Math.random() * 10));
      setEvents((prev) => {
        const pick = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)]!;
        return [
          { id: `l${Date.now()}`, ...pick, timestamp: stamp(new Date()) },
          ...prev.slice(0, 23),
        ];
      });
    }, 2500);
    return () => clearInterval(t);
  }, [autoRefresh]);

  return (
    <div className="bg-surface-50">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 bg-surface-0 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lg font-bold tracking-tight text-surface-900">Realtime Ops Center</p>
          <Badge variant="success" size="sm" dot>
            {autoRefresh ? "streaming" : "paused"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-1.5 font-mono text-xs tabular-nums text-success-500 shadow-inset">
            {stamp(now)}
          </code>
          <Button
            variant={autoRefresh ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setAutoRefresh((v) => !v)}
            leadingIcon={<RefreshCw className={cn("size-3.5", autoRefresh && "animate-spin")} />}
          >
            Auto-refresh
          </Button>
          <Badge variant="danger" size="sm" dot>
            <ShieldAlert className="mr-1 size-3" /> 3 alerts
          </Badge>
        </div>
      </div>

      {/* Status strip — pulse indicators */}
      <div className="flex flex-wrap gap-2 px-4 pt-4 sm:px-6">
        {SERVICES.map((s) => (
          <span
            key={s.name}
            className="inline-flex items-center gap-2 rounded-full border border-surface-200 bg-surface-0 px-3 py-1.5 text-xs font-medium text-surface-700 shadow-soft"
          >
            <span className={cn("size-2 animate-pulse rounded-full", s.cls)} />
            {s.name}
            <span className="font-mono text-xs uppercase text-surface-400">{s.state}</span>
          </span>
        ))}
      </div>

      {/* Live metric tiles */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:px-6 lg:grid-cols-4">
        {[
          {
            label: "Requests / min",
            value: requests,
            format: (n: number) => n.toLocaleString(),
            trend: traffic.slice(-12),
            delta: "+4.2%",
            up: true,
          },
          {
            label: "P50 latency",
            value: latency,
            format: (n: number) => `${n} ms`,
            trend: [42, 40, 44, 38, 41, 36, 39, 37, 34, 38, 33, 36],
            delta: "-8.6%",
            up: true,
          },
          {
            label: "Error rate",
            value: errorRate,
            format: (n: number) => `${n.toFixed(2)}%`,
            trend: [0.6, 0.55, 0.5, 0.58, 0.48, 0.44, 0.5, 0.42, 0.39, 0.36, 0.41, 0.38],
            delta: "-24%",
            up: true,
          },
          {
            label: "Active connections",
            value: connections,
            format: (n: number) => n.toLocaleString(),
            trend: [1100, 1140, 1110, 1180, 1160, 1200, 1170, 1220, 1190, 1230, 1210, 1240],
            delta: "steady",
            up: true,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-soft"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-surface-500">{m.label}</span>
              <span
                className={cn(
                  "font-mono text-xs",
                  m.up ? "text-success-500" : "text-danger-500",
                )}
              >
                {{ up: "▲", down: "▼" }[m.up ? "up" : "down"]} {m.delta}
              </span>
            </div>
            <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-surface-900">
              <AnimatedCounter value={m.value} format={m.format} />
            </p>
            <div className="mt-2 h-8">
              <Sparkline
                data={m.trend}
                colorClass={m.up ? "text-success-500" : "text-danger-500"}
                fill={false}
                className="h-full w-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Streaming chart + resource gauges */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-3 sm:px-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-success-500" />
              <p className="text-sm font-semibold text-surface-800">Request traffic</p>
              <Badge variant="success" size="sm">LIVE</Badge>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-surface-400">
              <span>
                cur <span className="text-success-500">{traffic[traffic.length - 1]}</span>
              </span>
              <span>
                peak <span className="text-surface-700">{Math.max(...traffic)}</span>
              </span>
              <span>
                avg{" "}
                <span className="text-surface-700">
                  {Math.round(traffic.reduce((a, b) => a + b, 0) / traffic.length)}
                </span>
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Sparkline data={traffic} colorClass="text-success-500" fill className="h-44 w-full" />
          </div>
          <p className="mt-3 text-xs text-surface-400">
            websocket stream · 1 sample / 2.5s · green = inside budget, spikes = load events
          </p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-warning-500" />
            <p className="text-sm font-semibold text-surface-800">Resource load</p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-4">
            {[
              { label: "CPU", value: cpu, tone: "brand" as const },
              { label: "Memory", value: memory, tone: "warning" as const },
              { label: "Load", value: load, tone: "danger" as const },
            ].map((g) => (
              <div key={g.label} className="flex items-center justify-between">
                <ProgressRadial value={g.value} tone={g.tone} size={64} stroke={6} label={`${g.value}%`} sublabel={g.label} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event console + open alerts */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 sm:px-6 lg:grid-cols-3">
        {/* The dark terminal — intentionally contrast in every theme */}
        <div className="lg:col-span-2">
          <LogStream entries={events} heightClass="h-80" />
        </div>

        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-surface-800">Open alerts</p>
            <Badge variant="danger" size="sm">{OPEN_ALERTS.length}</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {OPEN_ALERTS.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-2.5 rounded-xl border border-surface-100 bg-surface-50 px-3 py-2.5"
              >
                <Badge variant={a.severity} size="sm" dot className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm leading-snug text-surface-700">{a.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-surface-400">{a.time} ago</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-surface-400">
            Auto-refresh streams metrics, the chart and the console — every card follows the
            active theme.
          </p>
        </div>
      </div>
    </div>
  );
}