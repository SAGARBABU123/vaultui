#!/usr/bin/env node
/**
 * vault-ui — the Vault UI CLI.
 *
 *   vault-ui init                  → drop tokens.css + README into your project
 *   vault-ui add <component...>    → copy component source into your project
 *   vault-ui list                  → show everything in the registry
 *   vault-ui --version             → print version
 *
 * Options:
 *   --registry <url|path>  registry.json source (default: VAULT_REGISTRY env
 *                           or the published URL; use a local path for demos)
 *   --out <dir>            target directory for added components
 *                           (default: ./src/components/vault)
 *   --css-out <dir>        target for stylesheets (default: --out)
 *
 * Zero runtime dependencies — plain Node.
 */

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERSION = "0.1.0";

const DEFAULT_REGISTRY =
  process.env.VAULT_REGISTRY ?? "https://vault-ui.vercel.app/registry.json";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RED = "\x1b[31m";

function log(...args) {
  console.log(...args);
}

function warn(...args) {
  console.log(YELLOW + "[warn]" + RESET, ...args);
}

function fail(message) {
  console.error(RED + "[error]" + RESET, message);
  process.exit(1);
}

/* ------------------------------ registry io ------------------------------ */

async function loadRegistry(location) {
  let source;
  if (!location) location = DEFAULT_REGISTRY;
  if (location.startsWith("http://") || location.startsWith("https://")) {
    try {
      const res = await fetch(location);
      if (!res.ok) fail(`registry request failed (${res.status}): ${location}`);
      source = await res.text();
    } catch (err) {
      fail(`could not fetch registry ${location}: ${err.message}`);
    }
  } else {
    try {
      source = await readFile(location, "utf8");
    } catch {
      fail(`could not read registry file: ${location}`);
    }
  }
  try {
    const parsed = JSON.parse(source);
    if (!Array.isArray(parsed.components)) fail("registry.json missing `components` array");
    return parsed.components;
  } catch (err) {
    fail(`invalid registry JSON: ${err.message}`);
  }
}

/* --------------------------------- init ---------------------------------- */

async function cmdInit({ cssOut }) {
  const outDir = path.resolve(cssOut ?? "src");
  const tokensPath = path.join(outDir, "tokens.css");
  const readmePath = path.join(outDir, "VAULT-README.md");

  await mkdir(outDir, { recursive: true });

  // Tokens.css ships inside the @vaultui/tokens package — try it, else use a
  // local copy if present in the CLI's workspace.
  let tokens = null;
  for (const candidate of [
    path.join(__dirname, "..", "tokens", "src", "tokens.css"),
    path.join(__dirname, "..", "..", "packages", "tokens", "src", "tokens.css"),
  ]) {
    try {
      tokens = await readFile(candidate, "utf8");
      break;
    } catch {
      /* next */
    }
  }
  if (!tokens) {
    tokens = `/* Vault UI tokens — install @vaultui/tokens and import its tokens.css */\n`;
  }

  await writeFile(tokensPath, tokens);
  await writeFile(
    readmePath,
    `# Vault UI — initialized\n\n- \`tokens.css\` — the full soft-UI theme (palette, radii, shadows, motion).\n- Import it in your CSS entry:\n\n  \`\`\`css\n  @import "./tokens.css";\n  \`\`\`\n\n- Then add components:  \n  \`\`\`bash\n  npx vault-ui add switch input modal\n  \`\`\`\n`,
  );

  log(GREEN + "✓" + RESET, BOLD + "Vault UI initialized" + RESET);
  log("  tokens  → " + DIM + tokensPath + RESET);
  log("  readme  → " + DIM + readmePath + RESET);
  log("");
  log(DIM + "Import tokens.css from your CSS entry, then run `vault-ui add <component>`." + RESET);
}

/* ---------------------------------- add ----------------------------------- */

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function cmdAdd(names, { registry, out, cssOut }) {
  if (names.length === 0) fail("add needs at least one component name — e.g. `vault-ui add switch modal`");
  const components = await loadRegistry(registry);
  const outDir = path.resolve(out ?? "src/components/vault");
  const cssDir = path.resolve(cssOut ?? outDir);

  const found = [];
  const missing = [];
  for (const raw of names) {
    const id = slugify(raw);
    const entry = components.find((c) => c.id === id || slugify(c.name) === id);
    if (!entry) {
      missing.push(raw);
      continue;
    }
    found.push(entry);
  }
  if (missing.length > 0) warn(`unknown components, skipped: ${missing.join(", ")}`);
  if (found.length === 0) fail("nothing to add");

  let written = 0;
  const writtenTargets = new Set();
  const packages = new Set();
  for (const entry of found) {
    if (entry.via === "package") packages.add(entry.package);
    if (entry.files.length === 0) {
      // Paid kit — ships via the npm package, no source drop.
      log(YELLOW + "ⓘ" + RESET, `${entry.name} is a paid kit component — installs via ${entry.package} (commercial license).`);
      continue;
    }
    for (const file of entry.files) {
      const rel = file.path;
      const isCss = rel.endsWith(".css");
      const target = path.join(isCss ? cssDir : outDir, rel.replace(/^src\/components\/vault\//, ""));
      if (writtenTargets.has(target)) continue;
      writtenTargets.add(target);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, file.content);
      written++;
      log(GREEN + "✓" + RESET, DIM + target + RESET);
    }
  }

  log("");
  log(BOLD + `Added ${found.length} component${found.length === 1 ? "" : "s"} (${written} file${written === 1 ? "" : "s"}).` + RESET);

  const deps = [...packages];
  if (deps.length > 0) {
    log("");
    log(BOLD + "Install the dependencies:" + RESET);
    log(CYAN + "  pnpm add " + deps.join(" ") + RESET);
  }
  const needsUtils = found.some((e) => e.files.some((f) => f.content.includes("@vaultui/utils")));
  const needsTokens = found.some((e) => e.files.some((f) => f.content.includes("var(--color") || f.path.endsWith(".css")));
  const extra = [];
  if (needsUtils && !deps.includes("@vaultui/utils")) extra.push("@vaultui/utils");
  if (needsTokens && !deps.includes("@vaultui/tokens")) extra.push("@vaultui/tokens");
  if (extra.length > 0) log(CYAN + "  pnpm add " + extra.join(" ") + RESET);

  log("");
  log(DIM + "Import the component in your code, and make sure tokens.css is loaded (run `vault-ui init` if not)." + RESET);
}

/* ---------------------------------- list ---------------------------------- */

async function cmdList({ registry }) {
  const components = await loadRegistry(registry);
  const free = components.filter((c) => c.tier === "free");
  const paid = components.filter((c) => c.tier === "paid");
  log(BOLD + `Vault UI registry — ${components.length} components` + RESET);
  log("");
  log(BOLD + "Free (source-installable):" + RESET);
  for (const c of free) log(`  ${GREEN}•${RESET} ${c.id.padEnd(16)} ${DIM}${c.name}${RESET}`);
  log("");
  log(BOLD + "Paid (via npm packages):" + RESET);
  for (const c of paid) log(`  ${YELLOW}•${RESET} ${c.id.padEnd(16)} ${DIM}${c.package}${RESET}`);
}

/* ---------------------------------- main ---------------------------------- */

async function main() {
  const args = process.argv.slice(2);
  const opts = {};
  const names = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--registry" || a === "--out" || a === "--css-out") {
      opts[a.slice(2).replace("-", "")] = args[++i];
    } else if (a === "--version" || a === "-v") {
      log(VERSION);
      return;
    } else if (a.startsWith("-")) {
      fail(`unknown option: ${a}`);
    } else {
      names.push(a);
    }
  }

  const cmd = names.shift();
  switch (cmd) {
    case "init":
      await cmdInit(opts);
      break;
    case "add":
      await cmdAdd(names, opts);
      break;
    case "list":
      await cmdList(opts);
      break;
    case undefined:
      log(
        [
          BOLD + "vault-ui " + VERSION + RESET,
          "",
          "Usage:",
          "  vault-ui init                     initialize tokens.css + README",
          "  vault-ui add <component...>        add components to your project",
          "  vault-ui list                     list the registry",
          "",
          "Options:",
          "  --registry <url|path>   registry.json location",
          "  --out <dir>             component output (default: ./src/components/vault)",
          "",
          "Examples:",
          "  vault-ui init",
          "  vault-ui add switch modal toast",
          "  vault-ui add kpi-card --registry ./registry.json",
        ].join("\n"),
      );
      break;
    default:
      fail(`unknown command: ${cmd}`);
  }
}

main().catch((err) => {
  fail(err.message);
});