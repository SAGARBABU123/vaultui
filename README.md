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
│   ├── ai-chat/      # 🤖 AI Agent Kit — 11 components
│   ├── commerce/     # 🛒 Commerce Kit — 5 components
│   ├── configs/      # shared tsconfig
│   ├── data-viz/     # 📈 Data Viz Pro — 5 components
│   ├── dev-tools/    # 🧰 Dev Tools Kit — 4 components
│   ├── project/      # 🗂️ Project Mgmt Kit — 3 components
│   ├── tokens/       # design tokens / theme engine (Tailwind v4 CSS-first)
│   ├── utils/        # cn() + shared helpers
│   └── ui/           # free-tier components (MIT teaser)
├── LICENSE           # MIT (free tier)
├── COMMERCIAL-LICENSE.md
├── RELEASE.md        # npm publish guide
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