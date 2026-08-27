# 💎 Vault UI

**Premium React + Tailwind components — the ones you can't find elsewhere.**

A Turborepo monorepo: Storybook showroom as the storefront, package-per-kit, and a token-driven theme engine.

> ⚠️ **Working name.** Renaming later = one find-replace of `@vault` / `vault-ui`.

## Structure

```
vault-ui/
├── apps/
│   └── showroom/     # Storybook — the storefront
├── packages/
│   ├── configs/      # shared tsconfig
│   ├── tokens/       # design tokens / theme engine (Tailwind v4 CSS-first)
│   ├── utils/        # cn() + shared helpers
│   └── ui/           # free-tier components (teaser) — kits to come
├── turbo.json
└── pnpm-workspace.yaml
```

## Getting started

```bash
pnpm install
turbo typecheck        # or: pnpm typecheck
pnpm storybook         # opens Storybook on :6006
```

## Roadmap

See [`../component-marketplace-roadmap.md`](../component-marketplace-roadmap.md) for the full phased plan (Phase 0–6).

## Commands (Turborepo)

| Command        | What it does                 |
| -------------- | ---------------------------- |
| `turbo dev`    | run all dev tasks            |
| `turbo build`  | build all (cached by turbo)  |
| `turbo typecheck` | typecheck all packages    |
| `pnpm storybook` | showroom only            |