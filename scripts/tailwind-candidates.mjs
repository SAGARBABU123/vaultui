/**
 * Mirrors Tailwind candidates from the shared @vaultui/* packages into each
 * app's scan root. Tailwind's automatic detection only sees files inside an
 * app root, so the workspace packages' utilities are written out as string
 * literals here (Tailwind scans file contents, not imports).
 *
 * Usage:  node scripts/tailwind-candidates.mjs
 * Output: apps/web/src/tailwind-utilities.ts, apps/showroom/src/tailwind-utilities.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const PACKAGES = [
  "ui",
  "utils",
  "tokens",
  "ai-chat",
  "data-viz",
  "commerce",
  "dev-tools",
  "project",
  "collab",
];

// The oxide Scanner isn't linked at the repo root under pnpm — pick it
// straight out of the virtual store by version dir.
const store = path.join(repoRoot, "node_modules", ".pnpm");
const oxideDir = fs
  .readdirSync(store)
  .find((d) => d.startsWith("@tailwindcss+oxide@"));
if (!oxideDir) throw new Error("Cannot locate @tailwindcss/oxide in the pnpm store");
const oxideEntry = path.join(
  store,
  oxideDir,
  "node_modules",
  "@tailwindcss",
  "oxide",
  "index.js",
);
const { Scanner } = await import(oxideEntry);

const candidates = new Set();
for (const pkg of PACKAGES) {
  const base = path.join(repoRoot, "packages", pkg, "src");
  const scanner = new Scanner({ sources: [{ base, pattern: "**/*", negated: false }] });
  for (const c of scanner.scan()) candidates.add(c);
}

const body = [
  "// AUTO-GENERATED from packages/*/src — do not edit by hand.",
  "// Regenerate with: node scripts/tailwind-candidates.mjs",
  "// Tailwind's automatic scan (an app root) can't reach the workspace packages,",
  "// so their utilities are mirrored here as plain string literals.",
  "export const sharedCandidates = [",
  ...[...candidates].sort().map((c) => `  ${JSON.stringify(c)},`),
  "] as const;",
  "",
].join("\n");

for (const app of ["apps/web/src", "apps/showroom/src"]) {
  const out = path.join(repoRoot, app, "tailwind-utilities.ts");
  fs.writeFileSync(out, body);
  console.log(`wrote ${out} (${candidates.size} candidates)`);
}