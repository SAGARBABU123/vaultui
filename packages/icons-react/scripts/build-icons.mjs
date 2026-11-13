/**
 * Vault Icons React - per-weight ESM module builder.
 *
 * Runs after tsup (which emits the bundled CJS root). This script:
 *   - transpiles src/icons/<name>/<weight>.tsx -> dist/icons/<name>/<weight>.js (ESM)
 *   - writes matching .d.ts declarations
 *   - writes per-icon index.js / index.d.ts (six re-exports)
 *   - writes the thin ESM root dist/index.js
 *   - copies src/types.ts -> dist/types.d.ts
 *   - ensures both index.d.ts and index.d.cts exist for the root entries
 */

import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const srcDir = path.join(pkgRoot, "src");
const srcIcons = path.join(srcDir, "icons");
const distDir = path.join(pkgRoot, "dist");
const distIcons = path.join(distDir, "icons");

const WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"];
const SUFFIX = { thin: "Thin", light: "Light", regular: "", bold: "Bold", fill: "Fill", duotone: "Duotone" };
const EXPECTED_ICONS = 1557;

function pascal(name) {
  return name
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join("");
}

async function exists(file) {
  try {
    await readFile(file);
    return true;
  } catch {
    return false;
  }
}

async function loadEsbuild() {
  try {
    return await import("esbuild");
  } catch {
    const require = createRequire(import.meta.url);
    const tsupPkg = require.resolve("tsup/package.json");
    const esbuildEntry = require.resolve("esbuild", { paths: [path.dirname(tsupPkg)] });
    return import(pathToFileURL(esbuildEntry).href);
  }
}

function fail(message) {
  console.error(`build-icons: ${message}`);
  process.exit(1);
}

async function main() {
  const entries = await readdir(srcIcons, { withFileTypes: true });
  const names = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (names.length !== EXPECTED_ICONS) {
    fail(`expected ${EXPECTED_ICONS} icon dirs, found ${names.length}`);
  }

  const { transform } = await loadEsbuild();

  await rm(distIcons, { recursive: true, force: true });
  await mkdir(distIcons, { recursive: true });
  await copyFile(path.join(srcDir, "types.ts"), path.join(distDir, "types.d.ts"));

  const rootLines = [];
  let modules = 0;

  for (const name of names) {
    const component = pascal(name);
    const outDir = path.join(distIcons, name);
    await mkdir(outDir, { recursive: true });
    const indexLines = [];

    for (const weight of WEIGHTS) {
      const exportName = component + SUFFIX[weight];
      const source = await readFile(path.join(srcIcons, name, `${weight}.tsx`), "utf8");
      const result = await transform(source, {
        loader: "tsx",
        format: "esm",
        jsx: "automatic",
        target: "es2020",
        sourcemap: false,
        sourcefile: `${name}/${weight}.tsx`,
      });
      await writeFile(path.join(outDir, `${weight}.js`), result.code, "utf8");
      await writeFile(
        path.join(outDir, `${weight}.d.ts`),
        `import type { VaultIconProps } from "../../types.js";\n\n` +
          `export declare function ${exportName}(props: VaultIconProps): import("react").ReactElement;\n` +
          `export default ${exportName};\n`,
        "utf8",
      );
      indexLines.push(`export { ${exportName} } from "./${weight}.js";`);
      modules += 1;
    }

    const indexSource = indexLines.join("\n") + "\n";
    await writeFile(path.join(outDir, "index.js"), indexSource, "utf8");
    await writeFile(path.join(outDir, "index.d.ts"), indexSource, "utf8");
    rootLines.push(`export * from "./icons/${name}/index.js";`);
  }

  if (modules !== EXPECTED_ICONS * WEIGHTS.length) {
    fail(`expected ${EXPECTED_ICONS * WEIGHTS.length} weight modules, wrote ${modules}`);
  }

  await writeFile(path.join(distDir, "index.js"), rootLines.join("\n") + "\n", "utf8");

  if (!(await exists(path.join(distDir, "index.cjs")))) {
    fail("tsup did not emit dist/index.cjs");
  }

  const declarations = ["index.d.ts", "index.d.cts", "index.d.mts"];
  let declarationSource = null;
  for (const file of declarations) {
    if (await exists(path.join(distDir, file))) {
      declarationSource = file;
      break;
    }
  }
  if (!declarationSource) {
    fail("tsup did not emit a root declaration file");
  }
  const declaration = await readFile(path.join(distDir, declarationSource));
  for (const target of ["index.d.ts", "index.d.cts"]) {
    if (!(await exists(path.join(distDir, target)))) {
      await writeFile(path.join(distDir, target), declaration);
    }
  }

  console.log(
    `build-icons: ${names.length} icons x ${WEIGHTS.length} weights = ${modules} ESM modules; root declarations from ${declarationSource}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
