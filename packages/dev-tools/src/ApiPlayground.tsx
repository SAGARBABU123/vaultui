import { Badge } from "@vault/ui";
import { cn } from "@vault/utils";
import { useState } from "react";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiPlaygroundProps {
  /** Base URL pre-filled in the request bar. */
  baseUrl?: string;
  className?: string;
}

interface HeaderRow {
  id: number;
  key: string;
  value: string;
}

/** Generate a deterministic fake response — pure client-side demo. */
function fakeResponse(method: HttpMethod, url: string, body: string, latency: number) {
  const status =
    method === "GET" ? 200 : method === "POST" ? 201 : method === "DELETE" ? 204 : method === "PUT" ? 200 : 200;
  const route = url.split("?")[0]?.replace(/^https?:\/\/[^/]+/, "") || "/";
  return {
    status,
    statusText: status === 201 ? "Created" : status === 204 ? "No Content" : "OK",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-request-id": `req_${Math.random().toString(36).slice(2, 10)}`,
      "x-vault-demo": "true",
    },
    latency,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    json: {
      ok: status >= 200 && status < 300,
      method,
      route,
      echo: body ? JSON.parse(safeJson(body)) : null,
      server: "vault-demo-edge",
      t: Date.now(),
    },
  };
}

function safeJson(body: string): string {
  try {
    const parsed = JSON.parse(body);
    return JSON.stringify(parsed);
  } catch {
    return JSON.stringify({ raw: body });
  }
}

/**
 * ApiPlayground — mini-Postman request builder with a simulated
 * response panel (status, latency, headers, JSON body). Everything
 * is client-side; swap `fakeResponse` for a real fetch to go live.
 */
export function ApiPlayground({ baseUrl = "https://api.vault.dev", className }: ApiPlaygroundProps) {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState(`${baseUrl}/v1/kits`);
  const [headers, setHeaders] = useState<HeaderRow[]>([{ id: 1, key: "Authorization", value: "Bearer sk_vault_demo" }]);
  const [body, setBody] = useState('{\n  "name": "ai-chat",\n  "tier": "pro"\n}');
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<ReturnType<typeof fakeResponse> | null>(null);

  const send = () => {
    setSending(true);
    const latency = 140 + Math.floor(Math.random() * 260);
    window.setTimeout(() => {
      setResponse(fakeResponse(method, url, body, latency));
      setSending(false);
    }, 500);
  };

  const patchHeader = (id: number, field: "key" | "value", value: string) =>
    setHeaders((hs) => hs.map((h) => (h.id === id ? { ...h, [field]: value } : h)));

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-soft", className)}>
      {/* Request bar */}
      <div className="flex flex-col gap-2 border-b border-surface-200 p-3 sm:flex-row">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className={cn(
            "h-9 shrink-0 cursor-pointer rounded-lg border border-surface-200 bg-surface-50 px-2 font-mono text-xs font-bold outline-none",
            method === "GET" && "text-info-500",
            method === "POST" && "text-success-500",
            method === "DELETE" && "text-danger-500",
            (method === "PUT" || method === "PATCH") && "text-warning-500",
          )}
          aria-label="HTTP method"
        >
          {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          spellCheck={false}
          aria-label="Request URL"
          className="h-9 w-full flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 font-mono text-xs text-surface-700 outline-none focus:border-brand-400"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || url.trim() === ""}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-soft transition-colors hover:bg-brand-500 disabled:opacity-50"
        >
          {sending ? (
            <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* Request */}
        <div className="min-w-0 border-b border-surface-200 p-3 lg:border-b-0 lg:border-r">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-surface-400">Request</h3>
          <div className="space-y-1.5">
            {headers.map((h) => (
              <div key={h.id} className="flex gap-1.5">
                <input
                  value={h.key}
                  onChange={(e) => patchHeader(h.id, "key", e.target.value)}
                  placeholder="Header"
                  aria-label="Header name"
                  className="h-8 w-2/5 rounded-md border border-surface-200 bg-surface-50 px-2 font-mono text-[11px] outline-none focus:border-brand-400"
                />
                <input
                  value={h.value}
                  onChange={(e) => patchHeader(h.id, "value", e.target.value)}
                  placeholder="Value"
                  aria-label="Header value"
                  className="h-8 w-3/5 rounded-md border border-surface-200 bg-surface-50 px-2 font-mono text-[11px] outline-none focus:border-brand-400"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setHeaders((hs) => [...hs, { id: Date.now(), key: "", value: "" }])}
              className="text-[11px] font-medium text-brand-600 hover:text-brand-700"
            >
              + Add header
            </button>
          </div>
          {(method === "POST" || method === "PUT" || method === "PATCH") && (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              spellCheck={false}
              aria-label="Request body"
              className="mt-3 w-full resize-y rounded-lg border border-surface-200 bg-surface-50 p-2 font-mono text-[11px] leading-relaxed text-surface-700 outline-none focus:border-brand-400"
            />
          )}
        </div>

        {/* Response */}
        <div className="min-w-0 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-surface-400">Response</h3>
            {response && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={response.status < 300 ? "success" : "danger"} size="sm" dot>
                  {response.status} {response.statusText}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {response.latency}ms
                </Badge>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-surface-950 p-3 font-mono text-[11px] leading-relaxed">
            {response ? (
              <>
                <p className="text-surface-400">
                  <span className="text-surface-200">x-request-id:</span> {response.headers["x-request-id"]}
                </p>
                <pre className="mt-1 max-h-52 overflow-auto whitespace-pre-wrap break-words text-emerald-300">
                  {JSON.stringify(response.json, null, 2)}
                </pre>
              </>
            ) : (
              <p className="text-surface-500">Press Send to see a simulated response.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}