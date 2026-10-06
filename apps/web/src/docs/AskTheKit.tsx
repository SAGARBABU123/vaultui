import { useMemo, useRef, useState } from "react";
import { cn } from "@vaultui/utils";
import { ALL_GROUPS } from "../projects/entries";
import { CopyButton } from "@vaultui/ui";
import { scriptedAnswer } from "./askKitScripts";

/**
 * "Ask the Kit" — an in-docs assistant over the live registry.
 *
 * Two layers:
 *  1. SCRIPTED INTENTS (deterministic, $0, instant, no AI) — component
 *     lookups, install/CLI, theming, licensing, pricing, kit/dashboard
 *     catalog. Answers come straight from registry + FAQ content.
 *  2. GEMINI FALLBACK — only when no script matches, via the serverless
 *     proxy (api/ask.ts), grounded on this project's knowledge base.
 */

interface ChatMsg {
  role: "user" | "kit";
  text: string;
  code?: string;
  /** True when this kit reply came from the Gemini fallback. */
  ai?: boolean;
}

const FAQ: Array<{ q: string; a: string; code?: string }> = [
  {
    q: "how do i install",
    a: "Add a component with the CLI, or install the package:",
    code: "npx vault-ui add switch modal toast\n\n# or via any manager — npm i / yarn add / pnpm add / bun add\nnpm i @vaultui/ui @vaultui/tokens",
  },
  {
    q: "free tier",
    a: "The free core is MIT on the public registry: Button, Badge, Card, Switch, forms, Tabs, Modal, Toast, DataTable, Calendar and the rest — 24 components, no account needed to use them.",
  },
  {
    q: "license",
    a: "Core is MIT; premium kits (AI, Data Viz, Commerce, Dev Tools, Project, Collab, Marketing) ship under a commercial license with the source included.",
  },
  {
    q: "theme",
    a: "Everything reads CSS variables. Four themes ship: Neumorphic (default), Glassmorphism, Dimensional Layering and Vintage Retro Film. Try them live with the Theme A/B or Theme wall views.",
    code: "html[data-theme=\"glassmorphism\"] {\n  --color-brand-600: #0068d6;\n}",
  },
  {
    q: "cli",
    a: "The vault-ui CLI inits the theme and adds components straight into your project:",
    code: "npx vault-ui init\nnpx vault-ui add data-table combobox",
  },
  {
    q: "pricing",
    a: "Free core forever. Premium kits ship under a single commercial license covering all kits, source included — the demo upgrade in the app flips instantly.",
  },
  {
    q: "tokens",
    a: "Token-first: one theme file drives color, radius, shadow and motion. Override CSS variables to re-brand — try the Rebrand Lab at /lab.",
  },
];

function textLower(s: string) {
  return s.toLowerCase();
}

/** Questions no script handled yet — surfaced in dev to grow the catalog. */
const missedScripts = new Set<string>();

export function AskTheKit() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Compact registry + FAQ knowledge base sent to the Gemini fallback. */
  const knowledge = useMemo(() => {
    const kits = ALL_GROUPS.map(
      (g) => `${g.group}: ${g.items.filter((i) => i.id !== "overview").map((i) => i.name).join(", ")}`,
    ).join("\n");
    const faq = FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}${f.code ? `\nCODE:\n${f.code}` : ""}`).join("\n\n");
    return [
      `KITS AND COMPONENTS:\n${kits}`,
      `FAQ:\n${faq}`,
      `THEMES: Neumorphic, Glassmorphism, Dimensional Layering, Vintage Retro Film.\nINSTALL: npm i / yarn add / pnpm add / bun add @vaultui/ui @vaultui/tokens (or npx vault-ui init / add).`,
    ].join("\n\n");
  }, []);

  /** Gemini fallback — POST to the serverless proxy; the key never leaves the server. */
  const geminiAsk = async (raw: string) => {
    setThinking(true);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: raw, context: knowledge }),
      });
      const data = await r.json().catch(() => null);
      const text = r.ok ? String(data?.text ?? "").trim() : "";
      if (!text) throw new Error("empty or failed response");
      const codeMatch = text.match(/```[\s\S]*?\n([\s\S]*?)```/);
      const code = codeMatch?.[1]?.trim();
      const body = codeMatch ? text.replace(/```[\s\S]*?```/g, "").trim() : text;
      setChat((prev) => [
        ...prev,
        { role: "user", text: raw },
        { role: "kit", text: body || "Here you go —", code, ai: true },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "user", text: raw },
        {
          role: "kit",
          text: "I couldn't answer that yet — I'm good at components, install, licensing, themes and pricing.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const ask = (raw: string) => {
    const query = textLower(raw.trim());
    if (!query) return;

    // 1) Scripted intents first — deterministic, instant, no AI involved.
    const scripted = scriptedAnswer(raw);
    if (scripted) {
      setChat((prev) => [...prev, { role: "user", text: raw }, { role: "kit", text: scripted.body, code: scripted.code }]);
      setQ("");
      return;
    }

    // 2) Not scripted → Gemini (free tier), grounded on this project's
    //    knowledge base. Log the miss once so the script catalog can grow.
    const key = raw.trim();
    if (!missedScripts.has(key)) {
      missedScripts.add(key);
      console.warn("[ask-the-kit] no script for:", key);
    }
    void geminiAsk(raw);
  };

  const suggestions = ["How to install", "Which themes?", "License — MIT?", "Free vs premium", "What's in the vault", "Data tables"];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 20);
        }}
        aria-label="Ask the kit"
        className="fixed bottom-5 left-5 z-[75] inline-flex h-11 items-center gap-2 rounded-full border border-surface-200 bg-surface-0 px-4 text-sm font-semibold text-surface-700 shadow-raised transition-all hover:text-surface-900 active:shadow-pressed"
      >
        <SparkIcon />
        Ask the kit
      </button>

      {open && (
        <div className="fixed bottom-20 left-5 z-[80] flex w-[min(380px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-raised animate-rise">
          <div className="flex items-center justify-between gap-2 border-b border-surface-100 px-4 py-3">
            <span className="text-sm font-semibold text-surface-900">Ask the kit</span>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="rounded-md p-1 text-surface-400 hover:text-surface-700">
              ✕
            </button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            {chat.length === 0 && !thinking && (
              <p className="text-sm leading-relaxed text-surface-400">
                Ask me about any component, install, licensing, theming or pricing — local answers first, and
                Gemini (grounded on this vault) tries the rest.
              </p>
            )}
            {chat.map((m, i) => (
              <div key={i} className={cn("text-sm leading-relaxed", m.role === "user" ? "text-right text-surface-400" : "text-surface-700")}>
                <p style={{ whiteSpace: "pre-line" }}>
                  {m.ai && (
                    <span className="mr-1.5 inline-block rounded bg-brand-100 px-1 py-0.5 align-middle text-xs font-bold uppercase tracking-wide text-brand-700">
                      AI
                    </span>
                  )}
                  {m.text}
                </p>
                {m.code && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-surface-800 bg-surface-950 text-left">
                    <div className="flex items-center justify-between border-b border-surface-800 px-2.5 py-1.5">
                      <span className="font-mono text-xs text-surface-400">snippet</span>
                      <CopyButton value={m.code} label="Copy snippet" />
                    </div>
                    <pre className="overflow-x-auto p-2.5 font-mono text-xs leading-relaxed text-surface-200">{m.code}</pre>
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <span className="inline-block size-3 animate-spin rounded-full border-2 border-surface-300 border-t-brand-600" />
                Asking Gemini…
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="rounded-full border border-surface-200 bg-surface-50 px-2.5 py-1 text-xs text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-800"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="border-t border-surface-100 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(q);
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. show me the data table…"
                className="vault-input"
              />
              <button type="submit" disabled={thinking} className="vault-btn vault-btn-primary vault-btn-sm">
                {thinking ? "…" : "Ask"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-brand-600" aria-hidden="true">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <path d="M12 8l1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2L12 8z" fill="currentColor" />
    </svg>
  );
}