#!/usr/bin/env node
/**
 * Verifies the published guarantees of the Vault Icons framework packages.
 *
 * What it proves:
 *   1. ESM deep imports work (default + named export are functions).
 *   2. The root ESM import and the root CJS require both work.
 *   3. Ten regular deep imports tree-shake to <= 2,048 B gzipped.
 *   4. A deep import type-checks with moduleResolution=bundler, jsx=react-jsx.
 *   5. The packed React tarball stays under the packed/unpacked budgets.
 *   6. Every React root/deep target and Vue/Svelte deep target exists on disk.
 *   7. attw --pack is clean on React.
 *
 * Any failure exits non-zero and prints a compact summary.
 *
 * Usage:
 *   node scripts/verify-icon-packages.mjs [--rebuild] [--keep] [--json]
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkgRoot = path.join(repoRoot, "packages");
const reactDir = path.join(pkgRoot, "icons-react");
const vueDir = path.join(pkgRoot, "icons-vue");
const svelteDir = path.join(pkgRoot, "icons-svelte");

const MB = 1_000_000;
const LIMIT = {
  packed: 1.6 * MB,
  unpacked: 25 * MB,
  gzip: 2_048,
  tscFiles: 15,
};
const DEEP_ICON = "acorn";

const args = new Set(process.argv.slice(2));
const forceRebuild = args.has("--rebuild");
const keepTemp = args.has("--keep");
const outputJson = args.has("--json");

const results = [];
const measured = {};

function record(status, gate, detail) {
  results.push({ status, gate, detail });
  const tag = status === "pass" ? "PASS" : "FAIL";
  console.log(`[${tag}] ${gate}${detail ? ` — ${detail}` : ""}`);
}

function pass(gate, detail) {
  record("pass", gate, detail);
}

function fail(gate, detail) {
  record("fail", gate, detail);
}

function bytes(n) {
  return `${n.toLocaleString("en-US")} B (${(n / MB).toFixed(2)} MB)`;
}

function quantize(value) {
  if (value === undefined || value === null) return value;
  return Math.round(value * 100) / 100;
}

function quote(value) {
  const text = String(value);
  if (!/[\s"&|<>^()]/.test(text)) return text;
  return `"${text.replace(/"/g, '\\"')}"`;
}

function run(command, commandArgs = [], options = {}) {
  const line = [command, ...commandArgs].map(quote).join(" ");
  const result = spawnSync(line, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    shell: true,
    env: { ...process.env, ...(options.env ?? {}) },
    maxBuffer: 64 * 1024 * 1024,
    timeout: options.timeout ?? 15 * 60 * 1000,
  });
  return {
    command: line,
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    signal: result.signal,
    error: result.error,
  };
}

function tail(text, lines = 12) {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(-lines)
    .join("\n");
}

function assertRun(result, gate, friendly) {
  if (result.status !== 0) {
    fail(gate, `${friendly}\n${tail(result.stderr || result.stdout)}`);
    return false;
  }
  return true;
}

function ensureBuilt() {
  const dist = path.join(reactDir, "dist");
  const hasDist = fs.existsSync(path.join(dist, "index.mjs")) || fs.existsSync(path.join(dist, "index.js"));
  if (!hasDist || forceRebuild) {
    const build = run("pnpm", ["--filter", "@vaultui/icons-react", "build"], { timeout: 20 * 60 * 1000 });
    if (!assertRun(build, "build @vaultui/icons-react", "React package build failed")) return false;
  }
  if (!fs.existsSync(path.join(vueDir, "src", "index.ts"))) {
    const genVue = run("pnpm", ["--filter", "@vaultui/icons-vue", "generate"]);
    if (!assertRun(genVue, "generate @vaultui/icons-vue", "Vue component generation failed")) return false;
  }
  if (!fs.existsSync(path.join(svelteDir, "src", "index.ts"))) {
    const genSvelte = run("pnpm", ["--filter", "@vaultui/icons-svelte", "generate"]);
    if (!assertRun(genSvelte, "generate @vaultui/icons-svelte", "Svelte component generation failed")) return false;
  }
  return true;
}

function measureDist() {
  const dist = path.join(reactDir, "dist");
  if (!fs.existsSync(dist)) {
    fail("dist metrics", "packages/icons-react/dist does not exist after build");
    return;
  }
  let total = 0;
  let count = 0;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile()) {
        total += fs.statSync(target).size;
        count += 1;
      }
    }
  };
  walk(dist);
  measured.distBytes = total;
  measured.fileCount = count;
  pass("dist metrics", `${bytes(total)} across ${count} file(s)`);
}

function packReact() {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), "vaultui-pack-"));
  const pack = run("npm", ["pack", "--json", "--pack-destination", destination], { cwd: reactDir });
  if (!assertRun(pack, "npm pack @vaultui/icons-react", "npm pack failed")) return null;

  let parsed;
  try {
    parsed = JSON.parse(pack.stdout.trim());
  } catch (error) {
    fail("npm pack @vaultui/icons-react", `could not parse npm pack JSON: ${error.message}`);
    return null;
  }
  const info = Array.isArray(parsed) ? parsed[0] : parsed;
  const tarball = path.join(destination, info.filename);
  if (!fs.existsSync(tarball)) {
    fail("npm pack @vaultui/icons-react", `tarball not found at ${tarball}`);
    return null;
  }

  measured.packed = info.size;
  measured.unpacked = info.unpackedSize;
  measured.packedFileCount = info.entryCount;

  if (info.size <= LIMIT.packed) {
    pass("packed size", `${bytes(info.size)} <= ${bytes(LIMIT.packed)}`);
  } else {
    fail("packed size", `${bytes(info.size)} > ${bytes(LIMIT.packed)}`);
  }
  if (info.unpackedSize <= LIMIT.unpacked) {
    pass("unpacked size", `${bytes(info.unpackedSize)} <= ${bytes(LIMIT.unpacked)}`);
  } else {
    fail("unpacked size", `${bytes(info.unpackedSize)} > ${bytes(LIMIT.unpacked)}`);
  }
  return { tarball, destination };
}

function installFixture(tarball) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "vaultui-fixture-"));
  fs.writeFileSync(
    path.join(fixture, "package.json"),
    JSON.stringify({ name: "vaultui-pack-fixture", private: true, version: "0.0.0", type: "module" }, null, 2) + "\n",
  );
  const install = run(
    "npm",
    ["install", "--no-audit", "--no-fund", "--ignore-scripts", tarball, "react@18.3.1", "@types/react@18.3.0"],
    { cwd: fixture, timeout: 10 * 60 * 1000 },
  );
  if (!assertRun(install, "install fixture", "installing the packed tarball + React failed")) return null;

  const installedManifest = path.join(fixture, "node_modules", "@vaultui", "icons-react", "package.json");
  if (!fs.existsSync(installedManifest)) {
    fail("install fixture", "installed @vaultui/icons-react/package.json is missing");
    return null;
  }
  const pkg = JSON.parse(fs.readFileSync(installedManifest, "utf8"));
  return { dir: fixture, pkg };
}

function deepImportNames(fixture) {
  const iconsDir = path.join(fixture.dir, "node_modules", "@vaultui", "icons-react", "dist", "icons");
  return fs
    .readdirSync(iconsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== "*" && fs.existsSync(path.join(iconsDir, name, "regular.js")))
    .sort()
    .slice(0, 10);
}

function exposesDeepImports(pkg) {
  const keys = Object.keys(pkg.exports ?? {});
  return keys.some((key) => key === `./icons/${DEEP_ICON}/regular` || key === "./icons/*" || key.startsWith("./icons/*"));
}

function verifyDeepEsm(fixture) {
  const file = path.join(fixture.dir, "deep-import.mjs");
  fs.writeFileSync(
    file,
    [
      `import DefaultExport, * as namespace from "@vaultui/icons-react/icons/${DEEP_ICON}/regular";`,
      "const named = Object.entries(namespace).filter(([key, value]) => key !== \"default\" && typeof value === \"function\");",
      "if (typeof DefaultExport !== \"function\") throw new Error(`deep import default export is ${typeof DefaultExport}, expected function`);",
      "if (named.length === 0) throw new Error(\"deep import has no named function export\");",
      "if (!named.some(([, value]) => value === DefaultExport)) throw new Error(\"deep import named export does not match default export\");",
      "console.log(\"deep-esm \" + named.map(([key]) => key).join(\",\"));",
      "",
    ].join("\n"),
  );
  const result = run(process.execPath, [file], { cwd: fixture.dir });
  if (assertRun(result, "deep ESM import", `@vaultui/icons-react/icons/${DEEP_ICON}/regular failed to import`)) {
    pass("deep ESM import", result.stdout.trim());
  }
}

function verifyRootImports(fixture) {
  const esm = path.join(fixture.dir, "root-import.mjs");
  fs.writeFileSync(
    esm,
    [
      'import * as root from "@vaultui/icons-react";',
      'if (typeof root.Acorn !== "function") throw new Error("root ESM export Acorn is not a function");',
      'console.log("root-esm " + Object.keys(root).length + " exports");',
      "",
    ].join("\n"),
  );
  const esmResult = run(process.execPath, [esm], { cwd: fixture.dir });
  if (assertRun(esmResult, "root ESM import", "root ESM import failed")) {
    pass("root ESM import", esmResult.stdout.trim());
  }

  const cjs = path.join(fixture.dir, "root-require.cjs");
  fs.writeFileSync(
    cjs,
    [
      'const root = require("@vaultui/icons-react");',
      'if (typeof root.Acorn !== "function") throw new Error("root CJS export Acorn is not a function");',
      'console.log("root-cjs " + Object.keys(root).length + " exports");',
      "",
    ].join("\n"),
  );
  const cjsResult = run(process.execPath, [cjs], { cwd: fixture.dir });
  if (assertRun(cjsResult, "root CJS require", "root CJS require failed")) {
    pass("root CJS require", cjsResult.stdout.trim());
  }
}

function verifyBundle(fixture, names) {
  const entry = path.join(fixture.dir, "bundle-entry.jsx");
  const lines = names.map((name, index) => `import C${index} from "@vaultui/icons-react/icons/${name}/regular";`);
  lines.push(`console.log(${names.map((_, index) => `C${index}`).join(", ")});`, "");
  fs.writeFileSync(entry, lines.join("\n"));

  const outfile = path.join(fixture.dir, "bundle.js");
  const build = run(
    "pnpm",
    [
      "exec",
      "esbuild",
      entry,
      "--bundle",
      "--minify",
      "--format=esm",
      "--platform=browser",
      "--jsx=automatic",
      "--external:react",
      "--external:react/jsx-runtime",
      `--outfile=${outfile}`,
    ],
    { cwd: repoRoot },
  );
  if (!assertRun(build, "bundle 10 deep imports", "esbuild failed to bundle 10 regular deep imports")) return;

  const buffer = fs.readFileSync(outfile);
  const gzipped = zlib.gzipSync(buffer, { level: 9 });
  measured.gzip = gzipped.length;
  const detail = `${bytes(gzipped.length)} <= ${bytes(LIMIT.gzip)} (${names.length} icons)`;
  if (gzipped.length <= LIMIT.gzip) pass("10-icon gzip", detail);
  else fail("10-icon gzip", detail);
}

function verifyTypes(fixture) {
  const source = path.join(fixture.dir, "deep.tsx");
  fs.writeFileSync(
    source,
    [
      `import AcornRegular from "@vaultui/icons-react/icons/${DEEP_ICON}/regular";`,
      "export const example = <AcornRegular size={24} aria-label=\"acorn\" />;",
      "",
    ].join("\n"),
  );
  fs.writeFileSync(
    path.join(fixture.dir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          noEmit: true,
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          target: "ES2020",
          lib: ["ES2020", "DOM"],
          strict: true,
          skipLibCheck: true,
          types: [],
        },
        files: ["deep.tsx"],
      },
      null,
      2,
    ) + "\n",
  );

  const result = run("pnpm", ["exec", "tsc", "-p", path.join(fixture.dir, "tsconfig.json"), "--extendedDiagnostics", "--listFiles"], {
    cwd: repoRoot,
  });
  if (!assertRun(result, "tsc deep import", "tsc --noEmit on a deep import failed")) return;

  const match = result.stdout.match(/^Files:\s*(\d+)/m) || result.stderr.match(/^Files:\s*(\d+)/m);
  if (!match) {
    fail("tsc Files", "could not read the Files count from tsc --extendedDiagnostics");
    return;
  }
  const total = Number(match[1]);
  const packageFiles = result.stdout
    .split(/\r?\n/)
    .filter((line) => line.includes("@vaultui/icons-react"))
    .length;
  measured.tscFiles = packageFiles;
  measured.tscTotal = total;
  const detail = `${packageFiles} package declaration file(s) <= ${LIMIT.tscFiles} (tsc total ${total})`;
  if (packageFiles <= LIMIT.tscFiles) pass("tsc Files", detail);
  else fail("tsc Files", detail);
}

function verifyExportTargets() {
  const weights = ["thin", "light", "regular", "bold", "fill", "duotone"];
  const expected = ["dist/index.js", "dist/index.cjs", "dist/index.d.ts", "dist/index.d.cts"];
  for (const weight of weights) {
    expected.push(`dist/icons/acorn/${weight}.js`, `dist/icons/acorn/${weight}.d.ts`);
  }
  const missing = expected.filter((file) => !fs.existsSync(path.join(reactDir, file)));

  const vueFiles = ["acorn.vue", "acorn-thin.vue", "acorn-light.vue", "acorn-bold.vue", "acorn-fill.vue", "acorn-duotone.vue"];
  for (const file of vueFiles) {
    if (!fs.existsSync(path.join(vueDir, "src", "icons", file))) missing.push(`icons-vue/src/icons/${file}`);
  }
  const svelteFiles = vueFiles.map((file) => file.replace(/\.vue$/, ".svelte"));
  for (const file of svelteFiles) {
    if (!fs.existsSync(path.join(svelteDir, "src", "icons", file))) missing.push(`icons-svelte/src/icons/${file}`);
  }

  if (missing.length > 0) {
    fail("export targets", `missing ${missing.length} target(s): ${missing.slice(0, 5).join(", ")}`);
  } else {
    pass("export targets", "React root + 6 deep weights, Vue/Svelte 6 deep weights present");
  }
}

function verifyAttw(dir) {
  const result = run("pnpm", ["exec", "attw", "--pack", dir], { cwd: repoRoot });
  if (assertRun(result, "attw React", "attw --pack reported problems for @vaultui/icons-react")) {
    const summary = tail(result.stdout, 3).replace(/\s+/g, " ").trim();
    pass("attw React", summary || "clean");
  }
}

function printSummary() {
  const failures = results.filter((result) => result.status === "fail");
  console.log("\n=== measured ===");
  console.log(`dist bytes:     ${measured.distBytes ?? "n/a"}`);
  console.log(`fileCount:      ${measured.fileCount ?? "n/a"}`);
  console.log(`packed:         ${measured.packed ?? "n/a"}`);
  console.log(`unpacked:       ${measured.unpacked ?? "n/a"}`);
  console.log(`packed files:   ${measured.packedFileCount ?? "n/a"}`);
  console.log(`10-icon gz:     ${measured.gzip ?? "n/a"}`);
  console.log(`tsc Files:      ${measured.tscFiles ?? "n/a"}${measured.tscTotal ? ` (total ${measured.tscTotal})` : ""}`);

  if (outputJson) {
    console.log(
      JSON.stringify(
        {
          ok: failures.length === 0,
          measured,
          gates: results,
        },
        null,
        2,
      ),
    );
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} gate(s) failed: ${failures.map((result) => result.gate).join(", ")}`);
    return false;
  }
  console.log("\nAll icon package gates passed.");
  return true;
}

function main() {
  console.log(`repo: ${repoRoot}`);
  console.log(`limits: packed <= ${bytes(LIMIT.packed)}, unpacked <= ${bytes(LIMIT.unpacked)}, 10-icon gz <= ${LIMIT.gzip} B, tsc Files <= ${LIMIT.tscFiles}`);
  console.log(`node: ${process.version}\n`);

  if (!ensureBuilt()) return printSummary() && 0 || 1;
  measureDist();

  const packed = packReact();
  if (!packed) return printSummary() && 0 || 1;

  const fixture = installFixture(packed.tarball);
  if (!fixture) return printSummary() && 0 || 1;

  if (!exposesDeepImports(fixture.pkg)) {
    fail(
      "deep import exports",
      `@vaultui/icons-react does not expose per-icon deep imports (no "./icons/*" or "./icons/${DEEP_ICON}/regular" in exports)`,
    );
  } else {
    verifyDeepEsm(fixture);
    verifyTypes(fixture);
    verifyBundle(fixture, deepImportNames(fixture));
  }

  verifyRootImports(fixture);
  verifyExportTargets();
  verifyAttw(reactDir);

  if (!keepTemp) {
    fs.rmSync(fixture.dir, { recursive: true, force: true });
    fs.rmSync(packed.destination, { recursive: true, force: true });
  } else {
    console.log(`\nkept fixture: ${fixture.dir}`);
    console.log(`kept tarball: ${packed.tarball}`);
  }

  return printSummary() ? 0 : 1;
}

process.exitCode = main();
