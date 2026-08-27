import { cn } from "@vault/utils";
import { useMemo, useState } from "react";

export interface JsonPathTesterProps {
  defaultJson?: string;
  defaultPath?: string;
  className?: string;
}

const DEFAULT_JSON = `{
  "user": {
    "name": "Sagar",
    "email": "sagar@example.com",
    "projects": [
      { "name": "Vault UI", "stars": 1284, "paid": true },
      { "name": "Portfolio", "stars": 34, "paid": false }
    ]
  }
}`;

function splitPath(path: string): string[] | null {
  const trimmed = path.trim().replace(/^\$\.?/, "").replace(/^\$/, "");
  if (trimmed === "") return [];
  const tokens: string[] = [];
  const re = /\.([A-Za-z_$][\w$]*)|\[(\d+)\]|\[\*\]|\[['"]([^'"]+)['"]\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(trimmed)) !== null) {
    tokens.push(match[1] ?? match[2] ?? match[3] ?? "*");
  }
  // Re-validate: any leftover chars = invalid path
  const consumed = trimmed.replace(re, " ").trim();
  if (consumed.length > 0) return null;
  return tokens;
}

function evaluate(json: unknown, tokens: string[]): { value: unknown; ok: boolean; error?: string } {
  let current: unknown = json;
  for (const token of tokens) {
    if (token === "*") {
      if (Array.isArray(current)) {
        continue;
      }
      return { value: undefined, ok: false, error: "'*' only valid on arrays" };
    }
    if (current !== null && typeof current === "object" && token in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[token];
    } else if (Array.isArray(current) && /^\d+$/.test(token)) {
      current = current[Number(token)];
    } else {
      return { value: undefined, ok: false, error: `Path segment '${token}' not found` };
    }
  }
  return { value: current, ok: true };
}

/**
 * JsonPathTester — evaluate $.a.b[0]-style paths against a JSON body
 * with type badge, pretty output and inline errors.
 */
export function JsonPathTester({ defaultJson = DEFAULT_JSON, defaultPath = "$.user.projects[*].name", className }: JsonPathTesterProps) {
  const [jsonText, setJsonText] = useState(defaultJson);
  const [path, setPath] = useState(defaultPath);
  const [paths, setPaths] = useState<string[]>([]);

  const result = useMemo(() => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
    const tokens = splitPath(path);
    if (tokens === null) return { ok: false, error: "Invalid path syntax" };
    return { ...evaluate(parsed, tokens), ok: true as unknown as boolean };
  }, [jsonText, path]);

  const ok = result.ok !== false;
  const value = "value" in result ? (result as { value: unknown }).value : undefined;

  const typeOf = (v: unknown) =>
    Array.isArray(v) ? `array[${v.length}]` : v === null ? "null" : typeof v;

  const pushHistory = () => {
    const t = path.trim();
    if (t && !paths.includes(t)) setPaths((p) => [...p.slice(-8), t]);
  };

  return (
    <div className={cn("grid gap-3 lg:grid-cols-2", className)}>
      {/* Inputs */}
      <div className="space-y-3">
        <div className="flex gap-1.5">
          <span className="flex h-10 shrink-0 items-center rounded-lg bg-brand-600 px-2.5 font-mono text-sm font-bold text-white shadow-soft">
            $
          </span>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            spellCheck={false}
            onBlur={pushHistory}
            placeholder=".user.projects[0].name"
            aria-label="JSON path"
            className="h-10 w-full min-w-0 rounded-xl border-0 bg-surface-100 shadow-inset px-3 font-mono text-sm outline-none focus:border-brand-400"
          />
        </div>
        {paths.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {paths.map((p) => (
              <button key={p} type="button" onClick={() => setPath(p)} className="rounded-full border border-surface-200 px-2 py-0.5 font-mono text-xs text-surface-500 hover:border-brand-300 hover:text-brand-700">
                {p}
              </button>
            ))}
          </div>
        )}
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={10}
          spellCheck={false}
          aria-label="JSON"
          className="w-full resize-y rounded-lg border border-surface-200 bg-surface-950 p-3 font-mono text-xs leading-relaxed text-surface-200 outline-none focus:border-brand-400"
        />
      </div>

      {/* Output */}
      <div className="flex flex-col rounded-lg border border-surface-200 bg-surface-0 p-3 shadow-soft">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-surface-400">Result</span>
          {ok && (
            <span className="rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-500">
              {typeOf(value)}
            </span>
          )}
        </div>
        {ok ? (
          <pre className="max-h-80 flex-1 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface-50 p-3 font-mono text-[13px] leading-relaxed text-surface-800">
            {JSON.stringify(value, null, 2)}
          </pre>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-danger-200 bg-danger-500/5 p-6 text-sm text-danger-500">
            ⚠ {"error" in result ? String(result.error) : "Evaluation failed"}
          </div>
        )}
      </div>
    </div>
  );
}