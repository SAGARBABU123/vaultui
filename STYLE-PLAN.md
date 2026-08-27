# 🎨 How to Build YOUR Unique UI Style — Component-by-Component Plan

Goal: turn the docs explorer from "generic indigo kit" into something that's
**unmistakably yours**, one component at a time. Every step is small, testable
in the explorer, and one commit.

---

## Step 0 — Lock your Style DNA (do this BEFORE touching code · 1 session)

A unique style isn't one cool detail — it's a **consistent combination** of six
levers that every component follows. Answer these six questions:

| Lever | Question to answer | Options to pick from |
|---|---|---|
| **1. Color** | What's the emotional read? | A) one loud accent + neutrals · B) muted pastel palette · C) mono/near-black + single neon · D) warm "paper" neutrals · E) glassy light (blues/whites) |
| **2. Shape** | How curved are surfaces? | A) sharp/architectural (0–4px) · B) soft (8–12px) · C) playful (14–24px) · D) pill everything |
| **3. Type** | What voices speak? | A) modern grotesk + mono tags · B) editorial serif headings + sans body · C) mono-first everything · D) rounded display + body |
| **4. Motion** | How does it move? | A) fast snappy · B) slow soft fades · C) springy/bouncy · D) barely moves |
| **5. Surfaces** | How do cards feel? | A) flat + hairline borders · B) layered soft shadows · C) thick borders (neo-brutalist) · D) glassy blur |
| **6. Texture** | Any signature detail? | dot grid · grain · dashed accents · corner badges · underline highlights · angled chips |

**Combine your answers into a one-line identity**, e.g.:

> *"Warm paper neutrals + sharp 4px corners + editorial serif headings +
> springy micro-motion + hairline borders + dashed underline accents."*

Write that line at the top of `packages/tokens/src/tokens.css` — it's your
north star. Every component gets judged against it.

### 🎭 Four ready-made "personas" (copy one or mix)
| Persona | Colors | Radii | Type | Motion | Surfaces |
|---|---|---|---|---|---|
| **Neo-Brutal Dev** (edgy, bold) | white bg, near-black ink, one loud accent (orange/acid green) | 0–2px | mono labels + grotesk body | snappy | 2px solid borders, hard offset shadows (`4px 4px 0 black`) |
| **Soft Editorial** (premium, calm) | warm paper `#faf7f2`, ink `#1a1714`, one olive/terracotta accent | 6–10px | serif display (Source Serif) + Inter body | slow fades | hairline borders + tiny shadows |
| **Glass Light** (SaaS-techy) | white/`#f8f9fb`, blue-violet accent | 12–16px | Inter + JetBrains mono tags | soft spring | translucent + blur + soft shadows |
| **Dark Console** (power-user) | `#0b0e13` bg, `#e6e9ef` ink, single lime/cyan accent | 4–8px | mono-first | crisp | 1px glow borders |

> Pick ONE, then tweak. Don't blend personas until you've shipped the first
> three components — blending too early = generic again.

---

## The golden build order (why this order matters)

```
Tokens (the DNA)
  → Primitives (Button, Badge, Card, Input)   ← everything re-skins through these
    → Signature blocks (Chat bubble, ChatInput, KpiCard, PricingTable…)  ← what people SEE first
      → Kits (restyled last — they inherit everything)
```

Primitives first: restyle `Button` once and 30+ usages all over the app update
instantly. That's the token engine paying off — use it.

---

## Tier 0 — Design Tokens (30–60 min) · `packages/tokens/src/tokens.css`

Decisions to lock:
- [ ] Replace the indigo `brand` scale with YOUR palette (keep the `*-50…950` shape)
- [ ] Replace `surface` neutrals with your chosen base (warm/bright/dark)
- [ ] Set the radius table to ONE philosophy: `--radius-sm/md/lg/xl/2xl`
- [ ] Swap `--font-sans` (+ bundle your display font via @fontsource if chosen)
- [ ] Your motion: adjust `--animate-*` speeds, add your signature animation
- [ ] Your "texture" utility (dot grid / grain / dashed accent) as a small CSS class

**Done-check:** swatches in the explorer header change color instantly, all
cards re-radius instantly.

---

## Tier 1 — Primitives (the whole style hangs on these) · `packages/ui`

### 1️⃣ Button — the most-seen component (30–45 min)
**Style decisions:** border or shadow? pill or crisp? uppercase mono label
(console vibes) or normal-case? filled vs outline weighting? hover = darken,
lift, or offset-shadow? press = scale/translate?
**Tasks:** variants (primary/secondary/ghost/danger) · sizes (keep xs–xl) ·
leading/trailing icons · loading · fullWidth. Add `variant="outline"` with your
border style if persona demands it.
**Done-check:** it looks distinct from shadcn at a glance. Screenshot it.

### 2️⃣ Badge (15 min)
Chips inherit tokens automatically — just tune size, dot, and decide: filled
or tinted background? mono uppercase for persona A/D?

### 3️⃣ Card (15 min)
Set padding rhythm, the 4px-grid spacing, and the surface signature
(shadow style / border weight / optional blur). Add `dashed` border variant
if that's your texture.

### 4️⃣ Input family — **currently missing, create it** (40 min)
Style an `Input`, `Textarea`, `Select` and `Field` (label + help + error) in
`packages/ui`. Decisions: height (36/40/44?), border weight, focus ring vs
focus border, error color, placeholder color.
**Why now:** inputs are sprinkled through SqlBuilder/CartDrawer/JsonPathTester
— a single restyle updates them everywhere when you swap them in.

---

## Tier 2 — Signature blocks (what visitors see first) · restyle top 6

Ordered by "most eyes":

1. **ChatCanvas bubble + ChatInput** (`@gudipudimani/ai-chat`) — chat is your flagship
   demo. Decisions: bubble shape (radius+corner pin), avatar style, streaming
   caret color, input box treatment.
2. **KpiCard + Sparkline + ProgressRadial** (`@gudipudimani/data-viz`) — your charts'
   first impression. Tune value typography, delta badge, gauge stroke caps.
3. **PricingTable + CartDrawer** (`@gudipudimani/commerce`) — trust + money screens.
   Decisions: table header treatment, drawer surface (does it blur? border?),
   CTA emphasis.
4. **KanbanBoard** (`@gudipudimani/project`) — dot colors, card shadows, column bg.
5. **LogStream + DiffViewer** (`@gudipudimani/dev-tools`) — dark-mode surfaces; pick
   YOUR dark tones (don't keep the default slate-950 unless persona says so).
6. **PresenceList + LiveCursors + ActivityFeed** (`@gudipudimani/collab`) — avatar
   treatment, cursor shape, feed icons (lucide already).

For each: same 10-min loop →
`open explorer page → tweak token/class → typecheck → screenshot → commit`.

---

## Tier 3 — Kits final polish (1 session)

- Sweep every component against your **identity line** (Step 0)
- Consistency check: any hardcoded indigo? any `rounded-2xl` that should be
  your radius? any 6px spacing anomaly?
- Optional: implement **dark mode** via token overrides (your personas A/C/D
  basically want this)

---

## 🏃 The weekly rhythm (suggested)

| Week | Focus | Commit |
|---|---|---|
| 1 | Step 0 DNA + Tier 0 tokens + Button | `style: dna + tokens + button` |
| 1–2 | Badge, Card, Input family | `style: primitives` |
| 2–3 | Top-6 signature blocks | `style: signature blocks` |
| 3–4 | Kits sweep + polish + screenshots | `style: full re-skin` |

**Rule:** never modify a kit before the primitive it depends on is styled.
Cascade, don't patch.

---

## ✅ The 5-question consistency checklist (run per component)

1. Uses tokens only? (no hex literals, no inline radius/sizes)
2. Radius from your table? Shadows from your tokens?
3. Spacing on the 4px grid?
4. One accent color used correctly (not rainbow)?
5. Works at mobile width + keyboard focus visible?

If 1–5 pass → commit. If not → fix before moving on.