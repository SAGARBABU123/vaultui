import { useEffect, useState } from "react";
import { cn } from "@vaultui/utils";

/* ============================ PerformanceMonitor ========================== */

export interface PerformanceMonitorProps {
  /** Push a new sample every N ms. Default 500. */
  interval?: number;
  className?: string;
}

/** Live FPS/latency monitor — samples the animation frame rate + synthetic latency. */
export function PerformanceMonitor({ interval = 500, className }: PerformanceMonitorProps) {
  const [fps, setFps] = useState<number[]>([]);
  const [latency, setLatency] = useState<number[]>([]);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    const raf = () => {
      frames++;
      rafId = requestAnimationFrame(raf);
    };
    let rafId = requestAnimationFrame(raf);
    const tick = () => {
      const now = performance.now();
      const fpsNow = Math.round((frames * 1000) / (now - last));
      frames = 0;
      last = now;
      setFps((prev) => [...prev.slice(-20), Math.max(0, Math.min(120, fpsNow))]);
      setLatency((prev) => [...prev.slice(-20), Math.round(20 + Math.random() * 80)]);
    };
    const timer = window.setInterval(tick, interval);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearInterval(timer);
    };
  }, [interval]);

  const max = 120;
  const toPath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / Math.max(1, data.length - 1)) * 100} ${14 + (1 - v / max) * 56}`).join(" ");

  return (
    <div className={cn("rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-surface-400">Performance</span>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="size-1.5 animate-pulse rounded-full bg-success-500" />
          <span className="font-mono font-semibold text-surface-700">{fps.at(-1) ?? "--"} FPS</span>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <ChartLine title="Frame rate" path={toPath(fps)} color="var(--color-brand-600)" unit="fps" latest={fps.at(-1)} />
        <ChartLine title="Latency" path={toPath(latency)} color="var(--color-success-500)" unit="ms" latest={latency.at(-1)} />
      </div>
    </div>
  );
}

function ChartLine({ title, path, color, unit, latest }: { title: string; path: string; color: string; unit: string; latest?: number }) {
  return (
    <div>
      <p className="mb-1 flex items-baseline justify-between text-xs text-surface-500">
        {title}
        <span className="font-mono text-surface-700">{latest ?? "--"}<span className="text-surface-400"> {unit}</span></span>
      </p>
      <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="h-14 w-full">
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ transition: "d 0.2s" }} />
      </svg>
    </div>
  );
}

/* ============================== EnvVarsTable ============================== */

export interface EnvVar {
  key: string;
  value: string;
  secret?: boolean;
}

export interface EnvVarsTableProps {
  vars: EnvVar[];
  className?: string;
}

export function EnvVarsTable({ vars, className }: EnvVarsTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-surface-200 bg-surface-0 shadow-soft", className)}>
      <table className="vault-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th style={{ textAlign: "right" }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {vars.map((v) => (
            <tr key={v.key}>
              <td className="font-mono text-sm text-brand-700">{v.key}</td>
              <td className="font-mono text-sm">{v.secret ? "••••••••••••" : v.value}</td>
              <td style={{ textAlign: "right" }}>
                <span className={cn("font-mono text-xs", v.secret ? "text-danger-500" : "text-success-500")}>
                  {v.secret ? "secret" : "public"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =============================== JwtInspector ============================= */

export interface JwtParts {
  header: Record<string, string | number>;
  payload: Record<string, string | number | boolean | string[]>;
  signature: string;
}

export interface JwtInspectorProps {
  token?: string;
  className?: string;
}

const EXAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzA5MSIsInJvbGUiOiJwcmVtaXVtIiwiaWF0IjoxNzEzMjk2MDAwfQ.s3cr3t";

function decodeToken(token: string): JwtParts | null {
  const parts = token.split(".");
  if (parts.length < 3) return null;
  const decode = (seg: string) => {
    try {
      const pad = seg.length % 4 === 0 ? "" : "=".repeat(4 - (seg.length % 4));
      return JSON.parse(decodeURIComponent(escape(atob(seg.replace(/-/g, "+").replace(/_/g, "/") + pad))));
    } catch {
      return {};
    }
  };
  return {
    header: decode(parts[0] ?? ""),
    payload: decode(parts[1] ?? ""),
    signature: parts[2] ?? "",
  };
}

export function JwtInspector({ token, className }: JwtInspectorProps) {
  const [value, setValue] = useState(token ?? EXAMPLE_JWT);
  const parts = decodeToken(value);
  const keyColor = "text-brand-700";
  return (
    <div className={cn("space-y-3", className)}>
      <input value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false} className="vault-input font-mono text-xs" placeholder="Paste a JWT…" />
      {!parts ? (
        <p className="text-sm text-danger-500">That doesn't look like a JWT (expects header.payload.signature).</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <JsonCard title="Header" color="var(--color-info-500)" obj={parts.header} keyColor={keyColor} />
          <JsonCard title="Payload" color="var(--color-success-500)" obj={parts.payload} keyColor={keyColor} />
        </div>
      )}
    </div>
  );
}

function JsonCard({ title, color, obj, keyColor }: { title: string; color: string; obj: Record<string, unknown>; keyColor: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-surface-200 bg-surface-950">
      <div className="flex items-center gap-2 border-b border-surface-800 px-3 py-2">
        <span className="size-2 rounded-full" style={{ background: color }} />
        <span className="font-mono text-xs text-surface-400">{title}</span>
      </div>
      <pre className="p-3 font-mono text-xs leading-relaxed text-surface-200">
        {Object.entries(obj).map(([k, v], i) => (
          <div key={k}>
            <span className={keyColor}>"{k}"</span>
            <span className="text-surface-500">: </span>
            <span className="text-success-500">{JSON.stringify(v)}</span>
            {i < Object.entries(obj).length - 1 ? "," : ""}
          </div>
        ))}
      </pre>
    </div>
  );
}