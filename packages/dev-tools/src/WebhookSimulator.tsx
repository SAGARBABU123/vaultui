import { Badge } from "@vault/ui";
import { cn } from "@vault/utils";
import { RotateCw, Send } from "lucide-react";
import { useState } from "react";

export interface WebhookPreset {
  id: string;
  label: string;
  payload: Record<string, unknown>;
}

export interface WebhookSimulatorProps {
  presets?: WebhookPreset[];
  endpoint?: string;
  className?: string;
}

const DEFAULT_PRESETS: WebhookPreset[] = [
  {
    id: "card.charged",
    label: "card.charged",
    payload: { event: "card.charged", object: "event", data: { id: "ch_1", amount: 4900, currency: "usd", status: "succeeded" }, livemode: false },
  },
  {
    id: "user.created",
    label: "user.created",
    payload: { event: "user.created", data: { id: "u_92", email: "new@user.dev", plan: "pro" }, attempts: 1 },
  },
  {
    id: "build.failed",
    label: "build.failed",
    payload: { event: "build.failed", data: { pipeline: 8841, stage: "test", error: "ESLint failed" } },
  },
];

interface Attempt {
  id: string;
  status: number;
  statusText: string;
  latency: number;
  at: string;
  eventId: string;
}

/**
 * WebhookSimulator — send preset events to an endpoint placeholder,
 * with per-attempt status, latency, request-id and retries.
 */
export function WebhookSimulator({
  presets = DEFAULT_PRESETS,
  endpoint = "https://app.example.com/hooks/vault",
  className,
}: WebhookSimulatorProps) {
  const [url, setUrl] = useState(endpoint);
  const [activeId, setActiveId] = useState(presets[0]!.id);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sending, setSending] = useState(false);

  const active = presets.find((p) => p.id === activeId) ?? presets[0]!;

  const send = (preset: WebhookPreset, id = preset.id) => {
    setSending(true);
    const latency = 90 + Math.floor(Math.random() * 320);
    const ok = !(latency > 380); // occasional failure for realism
    window.setTimeout(() => {
      setAttempts((a) => [
        {
          id: `${id}-${Date.now()}`,
          status: ok ? 200 : 502,
          statusText: ok ? "OK" : "Bad Gateway",
          latency,
          at: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          eventId: `evt_${Math.random().toString(36).slice(2, 10)}`,
        },
        ...a,
      ]);
      setSending(false);
    }, 500);
  };

  return (
    <div className={cn("rounded-2xl border-0 bg-surface-0 shadow-soft", className)}>
      {/* Endpoint */}
      <div className="flex flex-col gap-2 border-b border-surface-200 p-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          spellCheck={false}
          aria-label="Webhook endpoint"
          className="h-9 w-full flex-1 rounded-lg border-0 bg-surface-100 shadow-inset px-3 font-mono text-xs outline-none focus:border-brand-400"
        />
        <button
          type="button"
          onClick={() => send(active)}
          disabled={sending}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
        >
          {sending ? (
            <RotateCw className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
          Send
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
        {/* Presets */}
        <div className="border-b border-surface-200 p-3 lg:border-b-0 lg:border-r">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-surface-400">Events</h3>
          <div className="space-y-1.5">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={cn(
                  "w-full rounded-xl border p-2.5 text-left transition-colors",
                  activeId === p.id ? "border-brand-300 bg-brand-50" : "border-surface-200 bg-surface-0 hover:border-brand-200",
                )}
              >
                <div className="flex items-center justify-between">
                  <code className="font-mono text-xs font-semibold text-surface-800">{p.label}</code>
                  <Badge variant="info" size="sm">
                    {Object.keys(p.payload).length} keys
                  </Badge>
                </div>
                <pre className="mt-1.5 line-clamp-1 text-[11px] text-surface-400">
                  {JSON.stringify(p.payload)}
                </pre>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-surface-950 p-3">
            <pre className="max-h-32 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-emerald-300">
              {JSON.stringify(active.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Attempts */}
        <div className="min-w-0 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-surface-400">Attempts</h3>
            <Badge variant="neutral" size="sm">
              {attempts.length}
            </Badge>
          </div>
          {attempts.length === 0 ? (
            <p className="py-10 text-center text-sm text-surface-400">Send an event to watch the request log.</p>
          ) : (
            <ul className="space-y-2">
              {attempts.map((a) => (
                <li key={a.id} className="rounded-xl border border-surface-200 p-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={a.status < 300 ? "success" : "danger"} size="sm" dot>
                      {a.status} {a.statusText}
                    </Badge>
                    <span className="text-xs text-surface-400">
                      {a.latency}ms · {a.at}
                    </span>
                    <button
                      type="button"
                      onClick={() => send(active, a.eventId)}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                      <RotateCw className="size-3" /> Retry
                    </button>
                  </div>
                  <p className="mt-1.5 break-all font-mono text-[11px] text-surface-400">{a.eventId}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}