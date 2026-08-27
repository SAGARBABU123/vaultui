# Release & Publish Guide

How to ship Vault UI packages to npm.

## Package map

| Package | License | Tier |
| --- | --- | --- |
| `@gudipudimani/tokens` | MIT | Free — theme engine |
| `@gudipudimani/utils` | MIT | Free — `cn()` helper |
| `@gudipudimani/ui` | MIT | Free — Button, Badge, Card |
| `@gudipudimani/ai-chat` | Commercial | Paid kit |
| `@gudipudimani/data-viz` | Commercial | Paid kit |
| `@gudipudimani/commerce` | Commercial | Paid kit |
| `@gudipudimani/dev-tools` | Commercial | Paid kit |
| `@gudipudimani/project` | Commercial | Paid kit |

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
pnpm --filter @gudipudimani/tokens publish
pnpm --filter @gudipudimani/utils publish
pnpm --filter @gudipudimani/ui publish
```

### Preview a paid kit (dry run)

```bash
pnpm --filter @gudipudimani/ai-chat pack --dry-run   # inspect tarball contents
```

### Publish a paid kit

```bash
pnpm --filter @gudipudimani/ai-chat publish --access public
# then the rest:
pnpm --filter @gudipudimani/data-viz publish
pnpm --filter @gudipudimani/commerce publish
pnpm --filter @gudipudimani/dev-tools publish
pnpm --filter @gudipudimani/project publish
```

## Version workflow

```bash
pnpm --filter @gudipudimani/ui version 0.2.0    # then commit + tag
pnpm --filter @gudipudimani/web run build       # sanity check consumers
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
npm i @gudipudimani/tokens @gudipudimani/ui
echo '@import "@gudipudimani/tokens/tokens.css";' > src/index.css
# render <Button> in React — themed by tokens
```