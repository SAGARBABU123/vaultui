# 💎 Vault UI

[![npm version](https://img.shields.io/npm/v/@vaultui/ui?color=5b66e8&label=npm%20v)](https://www.npmjs.com/package/@vaultui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@vaultui/ui?color=5b66e8)](https://www.npmjs.com/package/@vaultui/ui)
[![license](https://img.shields.io/badge/license-MIT%20%2B%20Commercial-5b66e8)](./LICENSE)
[![CI](https://github.com/SAGARBABU123/vaultui/actions/workflows/ci.yml/badge.svg)](https://github.com/SAGARBABU123/vaultui/actions/workflows/ci.yml)

**Premium React + Tailwind components — the ones you can't find elsewhere.**

A Turborepo monorepo: docs-explorer app, package-per-kit, token-driven theme engine, and an npm-published free tier (`@vaultui/ui`, `@vaultui/tokens`, `@vaultui/utils`).

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