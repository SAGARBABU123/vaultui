# Vault Icons — Program State & Resume Playbook

> Source of truth for resuming the icon program. If a session is lost, read this
> file top-to-bottom and continue. Update the snapshot after every collected batch.

Last updated: 2026-11-13 (dictionary expansion complete — 2,474 originals, deployed)
Repo: `C:\Users\Sagar Babu\vaultui` — GitHub `SAGARBABU123/vaultui`
Working branch: **`sagar/dev`** (do not work on `main`)

---

## 1. Current snapshot

| Item | Value |
| --- | --- |
| Commit (`sagar/dev`) | `48bc3e6` |
| Remote tip (`fork/sagar/dev`) | `48bc3e6` |
| Inventory | **2,474 icons × 6 weights = 14,844 SVGs** |
| Original masters | **2,474 (100%)** |
| Reference source | **none** |
| Validator | **PASS** — 0 problems |
| Site pages | 2,476 (index + 2,474 icon pages + 404) |
| Live URL | **https://icons.abhayaui.workers.dev** |
| Worker version | `2eab0e20-90e7-4179-92e4-317e8f66b62c` |
| Cloudflare account | `mani868849@gmail.com` (id `20d1209b…`) |
| Cloudflare account subdomain | `abhayaui` |
| Site features | multi-select cart · global icon colour picker (default currentColor) · philosophy + getting-started pages |

Per-category counts: core-ui 412 · objects-life 878 · dev-data 301 · alerts-status 174 ·
arrows 166 · communication 121 · media 120 · text 101 · files 91 · commerce 78.

---

## 2. Role model

- **Manager (me):** collect agent branches, verify diffs, build, validate, typecheck,
  deploy, update this file, assign next batches. Does not hand-draw icons.
- **Agent 1–6:** batch authors. **Batch program complete — no batches remain.**

**Hard rules for every agent**
1. Work in a **separate clone / git worktree** — never the manager's checkout.
2. One new file per batch: `packages/icons/original/specs-batch-<letter>.mjs`.
3. Never `git add -A`, never push `main`, never edit `build.mjs`, `specs.mjs`,
   `taxonomy.mjs`, app files, lockfiles or CI.
4. Base the branch on the latest `origin/sagar/dev`.
5. Commit only that one file; push the branch; report commit hash + counts.

**Master file contract**
```js
export const BATCH_X = { "icon-name": `<path .../>` };
export const BATCH_X_FILLS = { "icon-name": `<path .../>` }; // open-path icons only
```
- 24×24 grid, geometry inside 2.4–21.6, outline stroke 1.6 optically.
- Inner markup only — no `<svg>`, no `fill=`, no `stroke=`.
- 1–4 shapes, rounded caps/joins, closed shapes preferred.
- Every open-path glyph needs a solid silhouette in `*_FILLS`.
- Original geometry only — never copy/trace third-party sets.
- Skip names already `source: "original"` in `packages/icons/generated/manifest.json`.

---

## 3. Collection protocol (manager)

```bash
git fetch origin sagar/icons-batch-<letter>
git log --oneline -1 FETCH_HEAD
git diff --stat FETCH_HEAD^ FETCH_HEAD        # must be exactly 1 file
git checkout FETCH_HEAD -- packages/icons/original/specs-batch-<letter>.mjs
git commit -m "feat(icons): collect batch <X> originals (30 glyphs)"
node packages/icons/scripts/build.mjs
node packages/icons/scripts/validate-icons.mjs
pnpm --filter @vaultui/icons-site typecheck
pnpm --filter @vaultui/icons-site build
git push origin sagar/dev
# deploy (from apps/icons)
pnpm exec wrangler deploy
```
Then update §1 and §4 here.

`build.mjs` auto-merges every `original/specs-batch-*.mjs` file, so no wiring is needed.

### Batched verify mode (adopted 2026-11-12, saves time/tokens)

- **Every batch** (cheap): collect → one commit → `build.mjs` + `validate-icons.mjs` only.
- **Every ~5 batches / "ship" milestone**: `typecheck` + site `build` + `wrangler deploy`
  + push `sagar/dev` + update snapshot/ledger, once for the whole batch group.
- Rationale: a single batch never needs a full site rebuild or deploy; commit+push per
  batch keeps the safety net, the milestone step keeps the live site moving. `main` is
  still only merged at the end (phase 18).

---

## 4. Batch ledger

| Batch | Agent | Icons | Status | Originals after |
| --- | --- | --- | --- | --- |
| base `specs.mjs` | manager | 55 | done | 55 |
| C | Agent 1 | 30 | collected `152d95b` | 85 |
| D | Agent 3 | 30 | collected `f01a64a` | 115 |
| F | Agent 3 | 30 | collected `8fcd4d8` | 145 |
| E | Agent 1 | 30 | collected `16f1474` | 175 |
| G | Agent 2 | 30 | collected `ba1f239` | 205 |
| H | Agent 3 | 30 | collected `0b6823e` | 233 |
| I | Agent 1 | 30 | collected `c2348bd` | 263 |
| J | Agent 2 | 30 | collected `9ed477e` | 293 |
| K | Agent 3 | 30 | collected `56331be` | 323 |
| L | Agent 1 | 30 | collected `7a768e5` | 353 |
| M | Agent 2 | 30 | collected `c509851` | 383 |
| N | Agent 3 | 30 | collected `e705cde` | 413 |
| O | Agent 1 | 30 | collected `3a411c3` | 443 |
| P | Agent 2 | 30 | collected `3064dd9` | 473 |
| Q | Agent 3 | 30 | collected `56599f9` | 503 |
| R | Agent 1 | 30 | collected `4db48a8` | 533 |
| V | Agent 2 | 30 | collected `1eb6d8b` | 563 |
| W | Agent 3 | 30 | collected `b956114` | 593 |
| U | Agent 1 | 30 | collected `d8a3edd` | 623 |
| X | Agent 2 | 30 | collected `1e2955f` | 653 |
| AB | Agent 1 | 30 | collected `1ae167e` | 773 |
| AC | Agent 2 | 30 | collected `28afacc` | 803 |
| AD | Agent 3 | 30 | collected `335e52f` | 833 |
| AF | Agent 2 | 30 | collected `6683023` | 863 |
| AG | Agent 3 | 30 | collected `ba97d23` | 893 |
| AE | Agent 1 | 30 | collected `c70f94c` | 923 |
| AH | Agent 2 | 30 | collected `c7299f8` | 953 |
| AI | Agent 3 | 30 | collected `4743142` | 983 |
| AJ | Agent 1 | 30 | collected `48b149a` | 1013 |
| AK | Agent 2 | 30 | collected `bc0bb8f` | 1043 |
| AL | Agent 3 | 30 | collected `65982fa` | 1073 |
| AM | Agent 4 | 30 | collected `3e3735f` | 1103 |
| AN | Agent 5 | 30 | collected `8544a69` | 1133 |
| AO | Agent 6 | 30 | collected `94b8ab7` | 1163 |
| AP | Agent 1 | 30 | collected `9d73eec` | 1193 |
| AQ | Agent 2 | 30 | collected `6efa7be` | 1223 |
| AR | Agent 3 | 30 | collected `f1598c6` | 1253 |
| AS | Agent 4 | 30 | collected `5576373` | 1283 |
| AT | Agent 5 | 30 | collected `5547542` | 1313 |
| AU | Agent 6 | 30 | collected `20836fb` | 1343 |
| AV | Agent 1 | 30 | collected `aa6de68` | 1373 |
| AW | Agent 2 | 30 | collected `2377c89` | 1403 |
| AX | Agent 3 | 30 | collected `1049de8` | 1433 |
| AY | Agent 4 | 30 | collected `6cd9f49` | 1463 |
| AZ | Agent 5 | 30 | collected `078fd1f` | 1493 |
| BA | Agent 6 | 30 | collected `13dc500` | 1523 |
| BB | Agent 1 | 30 | collected `b77ce4c` | 1553 |
| BC | Agent 2 | 4 | collected `bedc52c` | 1557 |
| BD–BF | A1 | 90 | collected `5966dc0` | 1647 |
| BG–BI | A2 | 90 | collected `f4d4c0b` | 1737 |
| BJ–BL | A3 | 90 | collected `86936ee` | 1827 |
| BM–BN | A4 | 49 | collected `bc48f32` | 1876 |
| BO–BP | A5 | 35 | collected `a979f69` | 1911 |
| BQ–BS | A3 | 90 | collected `f4d4c0b` | 2001 |
| BT–BV | A1 | 88 | collected `f4d4c0b` | 2089 |
| BW–BY | A5 | 64 | collected `bc48f32` | 2153 |
| CA–CB, CG | A1 | 86 | collected `56fd7d2` | 2239 |
| CC–CD, CH | A2 | 85 | collected `2f06937` | 2324 |
| CE, CI–CJ | A3 | 80 | collected `4207f20` | 2404 |
| CK–CL | A4 | 33 | collected `040f2c3` | 2437 |
| CM–CN | A5 | 49 | collected `19cf600` | 2486 |

Deduped during collection: `skateboard`/`sled` (bt), `admission-tickets`/`circus-tent`/`kite` (bm/bt), `onion` (bw), `mushroom`/`desert`/`desert-island` (ce), `oyster` (cc), `honey-pot` (bv), `pushpin` (bq), `purse`/`torch` (bs/ch), `archive` (e). Final unique inventory **2,474**. Renamed `police-car-light` → `police-car-siren` (weight-suffix collision) and removed `mouse-trap` (dup of `mousetrap`).

**Batch program COMPLETE** — 2,474/2,474 icons are `source: "original"` (100%). No reference glyphs remain.

> S/T superseded: S (sports/fitness) folded into V; T (weather/nature) was covered by Q.
> Batch T (`8a2dc3c`) rejected on collection: 25/30 names already `original` (Q).

---

## 5. Phase board

**Complete**
1. Monorepo (`apps/components`, `apps/icons`, `apps/storybook`)
2. Icon pipeline (6 weights, shards, taxonomy, search index)
3. Icons app (light Vault theme, floating shell, virtualized grid, drawer, snippets)
4. SEO (1,556 per-icon pages, sitemap, 404, canonical, JSON-LD)
5. Interaction/a11y (keyboard grid nav, history-aware drawer, focus trap, skip link)
6. Cloudflare deploy (`icons.vaultui-icons-site.workers.dev`)
7. QA tooling (`validate-icons.mjs`, `contact-sheet.mjs`) + CI validation
8. Original glyph program — **COMPLETE (1,557/1,557 = 100%)**

**Pending**
10. Batch QA/audit (fill/duotone, optical consistency) per delivery
11. App: favorites/recents + persistence of weight/code tab
12. App: all-weights comparison + size control in drawer
13. Docs page (getting started / usage)
14. Distribution: `@vaultui/icons` npm package, sprite sheet, bulk download
15. SEO v2: category pages, OG images, internal linking
16. QA: Playwright e2e, Lighthouse CI, visual regression
17. CI/CD v2: Workers deploy workflow (currently Pages-based), preview deploys
18. Release ops: merge `main` PR (protected), Vercel root → `apps/components`
19. Cleanup: remove Phosphor + `THIRD-PARTY.md` when coverage hits 100%
20. Perf: font preload, hashed assets, cache headers
21. Search v2: ranking/typo tolerance, zero-result suggestions

---

## 6. Git & deploy notes

- `main` is **protected** (PR + 3 required checks). Direct push is rejected.
  Monorepo PR branch: `feat/monorepo` (`d7bc610`).
  Compare: `https://github.com/SAGARBABU123/vaultui/compare/main...feat/monorepo?expand=1`
- Cloudflare auth is stored (wrangler OAuth, `mani868849@gmail.com`) on a dedicated
  account (`20d1209b…`) separate from the `kaundinya` account — do not deploy to the
  `kaundinya` account (it hosts `admin`, `app`, `kaundinya-consultancy-marketing-page`).
- `apps/icons/wrangler.jsonc`: worker `icons`, static assets `./dist`,
  `not_found_handling: "404-page"`.
- Account workers.dev subdomain is `vaultui-icons-site` (locked; rename is a one-time
  dashboard-only action). The old `apps/web/design inspiratipn zip/*:Zone.Identifier`
  paths are invalid on Windows. The repo uses sparse-checkout; avoid plain `git add -A`.

---

## 7. Resume prompt (paste this when you come back)

```text
Read ICON-PROGRAM.md at the repo root and resume the Vault Icons program as manager.
1) Check sagar/dev and origin; collect any pushed sagar/icons-batch-* branches that are not merged.
2) For each: verify one-file diff, apply, build, validate, typecheck, site build, push, deploy.
3) Update ICON-PROGRAM.md snapshot + batch ledger.
4) Assign next 30-icon batches (R/S/T) to Agents 1/2/3 with the standard brief.
5) Report counts, coverage %, live URL and worker version.
```
