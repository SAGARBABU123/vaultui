# Release & Publish Guide

How to ship Vault UI packages to npm.

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

## How publishing works

Every publishable package:

- ships a **tsup build** (`esm` + `cjs` + `d.ts` + sourcemaps) to `dist/`
- has conditional exports — `development → src` (fast monorepo dev), `import/require → dist` (npm consumers)
- is gated by `prepublishOnly → pnpm run build`

### One-time setup

```bash
pnpm login --scope @vault
# enable 2FA — required for npm publish
```

### Publish the free tier first (order matters)

```bash
pnpm --filter @vaultui/tokens publish
pnpm --filter @vaultui/utils publish
pnpm --filter @vaultui/ui publish
```

### Preview a paid kit (dry run)

```bash
pnpm --filter @vaultui/ai-chat pack --dry-run   # inspect tarball contents
```

### Publish a paid kit

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
# in a fresh project:
npm i @vaultui/tokens @vaultui/ui
echo '@import "@vaultui/tokens/tokens.css";' > src/index.css
# render <Button> in React — themed by tokens
```