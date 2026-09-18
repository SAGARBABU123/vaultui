# Vault UI — Design System Reference

> Use this file whenever applying, restyling, or reusing the Vault UI design
> system in this or any other project ("use that design skill").

**North-star:** *warm paper neutrals + one indigo accent + tight radii +
light-from-above elevation + 4px spacing grid + constrained readable columns.*

---

## 1. Design Tokens (source: `packages/tokens/src/tokens.css`)

### Surfaces — WARM-tinted paper
| Step | Hex | Role |
|---|---|---|
| 0 | `#ffffff` | Panels, cards, inputs |
| 50 | `#faf9f8` | App/page background |
| 100 | `#f4f3f1` | Hover fills, subtle wells |
| 200 | `#e8e6e1` | Hairline borders |
| 300 | `#ddd9d2` | Muted dividers/disabled |
| 400 | `#b0aba0` | Hint text / datum labels |
| 500 | `#a49f93` | Muted icons |
| 600 | `#7a7465` | Secondary text (≥4.5:1 on white) |
| 700 | `#5f594d` | Strong secondary |
| 800 | `#48423a` | Titles on light |
| 900 | `#34312b` | Primary text |
| 950 | `#211f1a` | Code wells / deep layers |

### Brand — indigo (50–950)
`50 #eef0ff · 100 #e2e6ff · 200 #c9d0ff · 300 #a7b2fb · 400 #8b96f7 · 500 #6f7bf2 · 600 #5b66e8 · 700 #4a53c9 · 800 #3c44a5 · 900 #333a86 · 950 #242a5e`

### Semantics (50–950 scales)
`success-500 #2fbf7f · warning-500 #e8a93d · danger-500 #e56b7a · info-500 #5aa7e2`
Status chips: **50-tint bg + 700/800 text** (e.g. `bg-success-50 text-success-700`).

### Radii (px)
`xs 4 · sm 6 (buttons/inputs) · md 8 (cards/fields) · lg 12 (menus/toasts) · xl 16 (dialogs) · 2xl 20 (hero) · pills (999px) for badges/chips/avatars`

### Shadows — light from above, three tiers
- `soft` (sm) → buttons/cards: `0 1px 2px rgb(63 57 43/0.05), 0 2px 6px rgb(63 57 43/0.07)`
- `raised` (md) → dropdowns/popovers/tooltips: `0 2px 4px …/0.05, 0 10px 20px …/0.10`
- `popover` (lg) → modals/dialogs: `0 2px 6px …/0.06, 0 18px 40px …/0.14`
- `inset` (inputs/wells) · `pressed` (active buttons)
- Never upward shadows, never 0-offset blurs; two-part (tight + diffuse).

### Typography
- Sans **Inter Variable**, Mono **JetBrains Mono**; display = Inter.
- Scale (px): `12 · 14 · 16 · 18 · 20 · 24 · 30 · 36`
- Headings: display font, line-height 1.0–1.2 (`--leading-tight: 1.15`), semibold + `tracking-tight`.
- Body line-height 1.5–1.65; paragraphs ≤ 45–75 chars (`max-w-prose`); left-align; baseline-align mixed sizes.

### Spacing — strict 4px grid
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96 · 128` — no 10/14/22/6px.

## 2. Component rules (from the guidelines)

- **Badges**: `bg-*-50` + `text-*-700/800` + hairline `border-*-200/60`, pills — never solid saturated.
- **Buttons**: radius 6–8px from tokens; 150–200ms transitions; hover darken/lift (`shadow-raised`); press `shadow-pressed` + `scale(0.98)`; 4px-grid padding; labels never wrap.
- **Tooltips**: dark `surface-900`, white text, `4px 8px` padding, text-xs, **arrow**, md shadow, fade+slide.
- **Modals**: blurred dim backdrop, `max-w-md` (480px), lg shadow, title + X + cancel, animate rise.
- **Dropdowns**: md shadow, 1px border, opaque surface, animate; never inline-expand.
- **Inputs**: 40px height, `surface-200` border, inset shadow; focus = brand border + 3px ring; error = danger + tinted ring; `aria-invalid`.
- **Tabs/segmented**: pill container; active = surface-0 + brand text + soft shadow (not a filled button).
- **Nav active**: `bg-brand-50` + `text-brand-700`; inactive un-tinted.
- **Tables**: horizontal hairlines only; **right-align numbers**; uppercase 11px muted headers; hover row tint.
- **Checkbox/radio**: `items-start` alignment, 20px control, brand fill, focus ring.
- **Progress/sliders**: rounded + width transition; white thumb + brand border + shadow.
- **Feedback**: toasts bottom-right, compact, icon semantics, closeable; empty states = icon + title + body + CTA; skeletons pulse.
- **Motion**: ≤200ms micro-interactions; overlays fade/slide; respect reduced-motion.
- **Whitespace is required**: constrain content (`max-w-3xl/4xl`), don't stretch; space before borders.

## 3. Where things live

| Thing | Path |
|---|---|
| Tokens + themes | `packages/tokens/src/tokens.css`, `packages/tokens/src/themes.ts` |
| Core components | `packages/ui/src/*` (+ `button.css`, `primitives.css`) |
| Charts | `packages/data-viz/src/*` (+ `dataviz.css`) |
| Marketing | `packages/marketing/src/*` (+ `marketing.css`) |
| Guidelines docs | `apps/web/src/docs/guidelines/sections/*` |
| Storybook | `apps/showroom/src/stories/*` |
| Registry | `registry.json` |

## 4. Consuming in other projects

1. `pnpm add @vaultui/ui @vaultui/tokens` or copy the packages.
2. `@import "@vaultui/tokens/tokens.css"` → full token system available.
3. Rebrand by overriding one `[data-theme="…"]` block (`--color-*`, `--radius-*`, `--shadow-*`, `--font-*`); register in `themes.ts`.
4. Theme switch: `document.documentElement.dataset.theme = "…"` (default: Warm Paper).
5. Components are all token-driven + a11y-checked.

## 5. Consistency checklist

1. Tokens only — no hex literals, no inline radii/shadows.
2. Radius from table; shadows from tiers; light from above.
3. 4px grid; group spacing > inner spacing.
4. One indigo accent; semantic tints soft.
5. Mobile-safe, keyboard focus visible, contrast ≥4.5:1, not color-alone.

## 6. Live URLs

- Web app (components + guidelines + kit download): `https://vault-ui-bice.vercel.app`
- Storybook (all 138 components): `https://vault-ui-storybook.vercel.app`
- Repo: `https://github.com/SAGARBABU123/vaultui`