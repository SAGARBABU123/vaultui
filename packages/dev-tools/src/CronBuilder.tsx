import { cn } from "@vaultui/utils";
import { useMemo, useState } from "react";

export interface CronBuilderProps {
  defaultValue?: string;
  onChange?: (expression: string) => void;
  className?: string;
}

const MINUTES = ["*", "*/5", "*/10", "*/15", "*/30", "0", "15", "30", "45"];
const HOURS = ["*", "0", "1", "6", "9", "12", "15", "18", "23"];
const DOM = ["*", "1", "15"];
const MONTHS = ["*", "1", "6", "12"];
const DOW = ["*", "0", "1", "2", "3", "4", "5", "6"];

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 15 min", expr: "*/15 * * * *" },
  { label: "Hourly", expr: "0 * * * *" },
  { label: "Daily 9am", expr: "0 9 * * *" },
  { label: "Weekday 9am", expr: "0 9 * * 1-5" },
  { label: "Monthly 1st", expr: "0 9 1 * *" },
];

interface Field {
  key: string;
  label: string;
  options: string[];
}

const FIELDS: Field[] = [
  { key: "minute", label: "min", options: MINUTES },
  { key: "hour", label: "hour", options: HOURS },
  { key: "dom", label: "day of month", options: DOM },
  { key: "month", label: "month", options: MONTHS },
  { key: "dow", label: "day of week", options: DOW },
];

/** Minimal 5-field cron matcher (supports wildcard, step, ranges, lists). */
function matches(value: string, unit: number, max: number): boolean {
  const maxLen = String(max).length;
  const pad = (n: number) => String(n).padStart(maxLen, "0");
  const v = pad(unit);
  return value.split(",").some((part) => {
    if (part === "*") return true;
    const [range = "*", step] = part.split("/");
    const [lo, hi] = range.split("-");
    const stepN = step ? Number(step) : 1;
    const l = lo === "*" ? 0 : Number(lo);
    const h = hi ? Number(hi) : Number(lo);
    for (let n = l; n <= h; n += stepN) {
      if (pad(n) === v) return true;
    }
    return false;
  });
}

function nextRuns(expr: string, count = 3): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [minute, hour, dom, month, dow] = parts;
  const out: string[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  let guard = 0;
  while (out.length < count && guard++ < 200_000) {
    const [m, h, day, mon, wd] = [d.getMinutes(), d.getHours(), d.getDate(), d.getMonth() + 1, d.getDay()];
    // cron dow: 0=Sunday..6=Saturday; our matcher uses same
    const dayMatch = matches(dom ?? "*", day, 31) && matches(month ?? "*", mon, 12) && matches(dow ?? "*", wd, 6);
    const timeMatch = matches(minute ?? "*", m, 59) && matches(hour ?? "*", h, 23);
    if (dayMatch && timeMatch) out.push(d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
    d.setMinutes(d.getMinutes() + 1);
  }
  return out;
}

/**
 * CronBuilder — visual 5-field cron editor with presets and the
 * next 3 run times, computed client-side.
 */
export function CronBuilder({ defaultValue = "*/15 * * * *", onChange, className }: CronBuilderProps) {
  const [fields, setFields] = useState<string[]>(defaultValue.split(/\s+/));
  const expr = fields.join(" ");

  const runs = useMemo(() => nextRuns(expr), [expr]);

  const applyPreset = (e: string) => setFields(e.split(/\s+/));
  const patchField = (i: number, v: string) => setFields((f) => f.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className={cn("rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft", className)}>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.expr}
            type="button"
            onClick={() => applyPreset(p.expr)}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
              expr === p.expr
                ? "border-brand-400 bg-brand-50 text-brand-700"
                : "border-surface-200 bg-surface-0 text-surface-600 hover:border-brand-300",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {FIELDS.map((f, i) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-center text-xs font-medium text-surface-400">{f.label}</span>
            <select
              value={fields[i] ?? "*"}
              onChange={(e) => patchField(i, e.target.value)}
              aria-label={f.label}
              className="h-9 w-full cursor-pointer rounded-lg border-0 bg-surface-100 shadow-inset px-1 text-center font-mono text-xs outline-none focus:border-brand-400"
            >
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-surface-50 p-3">
        <p className="font-mono text-sm font-semibold text-brand-700">{expr || "—"}</p>
        <div className="mt-2 space-y-0.5">
          {runs.length > 0 ? (
            runs.map((r, i) => (
              <p key={i} className="text-xs text-surface-500">
                {i === 0 ? "Next run: " : "Then: "}
                {r}
              </p>
            ))
          ) : (
            <p className="text-xs text-danger-500">Invalid expression</p>
          )}
        </div>
      </div>

      {onChange !== undefined && expr !== defaultValue && (
        <button type="button" className="mt-3 text-xs font-medium text-brand-600 hover:text-brand-700" onClick={() => onChange(expr)}>
          Apply expression
        </button>
      )}
    </div>
  );
}