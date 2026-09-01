/**
 * Vault UI — Gemini-backed docs assistant (Vercel serverless function).
 *
 * The SPA's "Ask the kit" answers locally from the registry/FAQ when it can;
 * on a miss it POSTs here. The GEMINI_API_KEY stays server-side only — it is
 * never shipped to the browser bundle.
 *
 * Env (set in the Vercel dashboard → Project → Environment Variables):
 *   GEMINI_API_KEY — from https://aistudio.google.com/apikey (free tier)
 *   GEMINI_MODEL   — optional, default "gemini-2.0-flash"
 */

const DEFAULT_MODEL = "gemini-3.6-flash";
const RATE_LIMIT = { windowMs: 60_000, max: 15 };

/** Coarse per-IP limiter (in-memory per instance — enough for a demo). */
const hits = new Map<string, number[]>();

function allow(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (arr.length >= RATE_LIMIT.max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  return true;
}

function trim(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}\n[…truncated]` : s;
}

export default async function handler(req: any, res: any) {
  // Only JSON POSTs from the same origin.
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(503).json({ error: "GEMINI_API_KEY is not configured on the server." });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip)) {
    return res.status(429).json({ error: "Too many requests — slow down a little." });
  }

  let q = "";
  let context = "";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    q = String(body?.q ?? "").trim().slice(0, 500);
    context = trim(String(body?.context ?? ""), 8000);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  if (!q) return res.status(400).json({ error: "Missing question." });

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const system = trim(
    [
      "You are the Vault UI docs assistant — a React + Tailwind component library.",
      "Answer the user's question STRICTLY from the knowledge base below. Be concise, friendly and specific.",
      "When the knowledge base covers it, name exact components and give short copy-paste instructions.",
      "If the answer is genuinely not in the knowledge base, say you don't know and suggest 'Ask the kit' topics (components, install, licensing, themes, pricing).",
      "Use markdown; wrap code in ``` fences.",
      "",
      "KNOWLEDGE BASE:",
      context,
    ].join("\n"),
    12000,
  );

  const payload = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: q }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 900 },
  };

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error(`gemini ${r.status}: ${detail.slice(0, 300)}`);
      return res.status(502).json({ error: "The model service is unavailable right now." });
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();
    if (!text) return res.status(502).json({ error: "Empty model response." });
    return res.status(200).json({ text });
  } catch (err) {
    console.error("ask-kit error:", err);
    return res.status(500).json({ error: "Something went wrong on the server." });
  }
}