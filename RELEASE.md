# Release & Publish Guide

How to ship Vault UI packages — **one publication on npm**, consumed by every
package manager (npm, yarn, pnpm, bun).

## Package map

| Package | License | Tier |
| --- | --- | --- |
| `@vaultui/tokens` | MIT | Free — theme engine |
| `@vaultui/utils` | MIT | Free — `cn()` helper |
| `@vaultui/ui` | MIT | Free — Button, Badge, Card |
| `@vaultui/ai-chat` | Commercial | Paid kit |
| `@vaultui/data-viz` | Commercial | Paid kit |
| `@vaultui/commerce` | Commercial | Paid kit |
| `@vaultui/dev-tools` | Commercial | Paid kit |
| `@vaultui/project` | Commercial | Paid kit |

## Distribution model (industry standard)

One tarball on `registry.npmjs.org`, four install commands. This is exactly
how daisyUI / shadcn / Mantine work — there is **no separate bun/yarn/pnpm
registry**; bun (and every other manager) installs the same npm tarball.

| Consumer | Command |
| --- | --- |
| npm | `npm i @vaultui/ui @vaultui/tokens` |
| yarn | `yarn add @vaultui/ui @vaultui/tokens` |
| pnpm | `pnpm add @vaultui/ui @vaultui/tokens` |
| bun | `bun add @vaultui/ui @vaultui/tokens` |

CI (`.github/workflows/publish.yml`) smoke-tests **all four** paths after a
publish — including a real `bun add` + `bun build` consumer project.

## How publishing works

Every publishable package:

- ships a **tsup build** (`esm` + `cjs` + `d.ts` + sourcemaps) to `dist/`
- has conditional exports — `development → src` (fast monorepo dev), `import/require → dist` (npm consumers)
- is gated by `prepublishOnly → pnpm run build`

### One-time setup

```bash
pnpm login --scope @vault
# enable 2FA — required for npm publish
# (npm token also covers bun: bun installs npm packages with npm auth)
```

### Publish the free tier first (order matters)

```bash
# ⚠ Use `npm publish`, NOT `pnpm publish`:
#   - `npm publish` uploads the tarball blob BEFORE the registry metadata
#     (npm's current atomic-publish order). pnpm reverses it, which recent
#     npmjs builds accept as metadata-only → broken "ghost" versions.
#   - npm CLI does NOT rewrite `workspace:*` — runtimes deps must already be
#     concrete versions (ui's deps point at @vaultui/tokens@0.1.1 / utils@0.1.1).
cd packages/tokens && npm publish --access public
cd ../../packages/utils && npm publish --access public
cd ../../packages/ui && npm publish --access public
# or: pnpm publish:free  (safe for tokens/utils — no workspace:* runtime deps;
#     avoid for ui unless its deps are concrete + you verify the tarball)
```

> CI alternative: run the `Publish — npm` workflow
> (`.github/workflows/publish.yml`) with `workflow_dispatch`. Secret:
> `NPM_TOKEN` (GitHub → Settings → Secrets). It publishes via pnpm, then
> smoke-tests npm / yarn / pnpm / bun consumers.

### Preview a paid kit (dry run)

```bash
pnpm --filter @vaultui/ai-chat pack --dry-run   # inspect tarball contents
```### Publish a paid kit

```bash
pnpm --filter @vaultui/ai-chat publish --access public
# then the rest:
pnpm --filter @vaultui/data-viz publish
pnpm --filter @vaultui/commerce publish
pnpm --filter @vaultui/dev-tools publish
pnpm --filter @vaultui/project publish
```

## Version workflow

```bash
pnpm --filter @vaultui/ui version 0.2.0    # then commit + tag
pnpm --filter @vaultui/web run build       # sanity check consumers
```

## Monetization checklist (before real sales)

- [ ] Create a **Lemon Squeezy** product per kit (Single $49 / Team $149 / Source $299)
- [ ] Put the buy links into `apps/web/src/App.tsx` pricing CTAs (currently demo)
- [ ] Gate npm access: paid kits published to a **private scoped repo** or distributed via
      a license-keyed artifact server (e.g. `jsdelivr` + signed token)
- [ ] Add `purchases.ts` util to verify a license key before kit installation
- [ ] Wire `apps/web` checkout buttons → Stripe/LS checkout URLs from `site-config.ts`
- [ ] Launch kit: Product Hunt, X build-in-public thread, r/nextjs + r/reactjs posts
- [ ] Write 3–5 "migration from shadcn" tutorials + YouTube shorts

## Smoke test a consumer

```bash
# in a fresh project (npm):
npm i @vaultui/tokens @vaultui/ui
# render <Button> in React — themed by tokens

# in a fresh project (bun) — bun installs the same npm tarball:
bun add @vaultui/ui
bun build ./index.tsx --outdir out   # resolves ./button.css + ./primitives.css + ./tokens.css

# verify the published tarball is complete + has concrete deps (no workspace:*):
curl -sSL $(npm view @vaultui/ui@latest dist.tarball) | tar -xzO package/package.json | head -40
```
