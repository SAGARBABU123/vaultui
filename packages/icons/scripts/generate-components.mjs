/**
 * Vault Icons — framework component generator.
 *
 * Reads the original spec files (base specs.mjs + specs-batch-*.mjs) and emits
 * tree-shakeable framework packages:
 *   @vaultui/icons-react   → src/icons/<name>.tsx   (6 named exports per file)
 *   @vaultui/icons-vue     → src/icons/<name>.vue   (1 SFC per weight)
 *   @vaultui/icons-svelte  → src/icons/<name>.svelte (1 component per weight)
 *
 * Usage: node generate-components.mjs [react|vue|svelte|all]
 */

import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ORIGINAL_ICONS, ORIGINAL_FILLS } from "../original/specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const iconsRoot = path.resolve(here, "..");
const originalDir = path.join(iconsRoot, "original");
const repoRoot = path.resolve(iconsRoot, "..", "..");

const WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"];
const STROKE = { thin: "0.9", light: "1.25", regular: "1.6", bold: "2.4" };
const SUFFIX = { thin: "Thin", light: "Light", regular: "", bold: "Bold", fill: "Fill", duotone: "Duotone" };

async function loadBatches() {
  const files = (await readdir(originalDir))
    .filter((file) => /^specs-batch-.*\.mjs$/.test(file))
    .sort();
  const icons = {};
  const fills = {};
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(originalDir, file)).href);
    for (const [key, value] of Object.entries(mod)) {
      if (!key.startsWith("BATCH_")) continue;
      if (key.endsWith("_FILLS")) Object.assign(fills, value);
      else Object.assign(icons, value);
    }
  }
  return { icons, fills };
}

function pascal(name) {
  return name
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join("");
}

const iconName = (component, weight) => component + SUFFIX[weight];

const JSX_ATTR = {
  "fill-rule": "fillRule",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-miterlimit": "strokeMiterlimit",
  "clip-rule": "clipRule",
};

function parseElements(inner) {
  const out = [];
  const re = /<(\w+)([^>]*?)\/?>/g;
  let m;
  while ((m = re.exec(inner))) {
    const attrs = {};
    const are = /([\w-]+)="([^"]*)"/g;
    let a;
    while ((a = are.exec(m[2]))) attrs[a[1]] = a[2];
    out.push({ tag: m[1], attrs });
  }
  return out;
}

function toJsx(inner, indent = "      ") {
  return parseElements(inner)
    .map(({ tag, attrs }) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => `${JSX_ATTR[k] ?? k}="${v}"`)
        .join(" ");
      return `${indent}<${tag} ${a} />`;
    })
    .join("\n");
}

function indentSvg(markup, spaces) {
  const pad = " ".repeat(spaces);
  return markup
    .trim()
    .split("\n")
    .map((line) => pad + line.trim())
    .join("\n");
}

// ---------------------------------------------------------------------------
// React
// ---------------------------------------------------------------------------
function reactComponent(component, inner, fill) {
  const parts = WEIGHTS.map((w) => reactWeight(iconName(component, w), w, inner, fill));
  parts.push(`export { ${WEIGHTS.map((w) => iconName(component, w)).join(", ")} };`);
  return `import type { VaultIconProps } from "../types";

${parts.join("\n\n")}
`;
}

function reactWeight(exportName, weight, inner, fill) {
  const attrs = [
    'xmlns="http://www.w3.org/2000/svg"',
    'viewBox="0 0 24 24"',
    "width={size}",
    "height={size}",
  ];
  if (weight === "fill") {
    attrs.push('fill="currentColor"');
  } else {
    attrs.push('fill="none"', 'stroke="currentColor"');
    if (STROKE[weight]) attrs.push(`strokeWidth={${STROKE[weight]}}`);
    attrs.push('strokeLinecap="round"', 'strokeLinejoin="round"');
  }
  attrs.push('aria-hidden="true"', "{...props}");
  const body = reactBody(weight, inner, fill);
  const attrLines = attrs.map((a) => `        ${a}`).join("\n");
  return `function ${exportName}({ size = 24, ...props }: VaultIconProps) {
  return (
    <svg
${attrLines}
    >
${body}
    </svg>
  );
}`;
}

function reactWeightComponent(exportName, weight, inner, fill) {
  const component = reactWeight(exportName, weight, inner, fill).replace(
    `function ${exportName}`,
    `export function ${exportName}`,
  );
  return `import type { VaultIconProps } from "../../types";

${component}

export default ${exportName};
`;
}

function reactBody(weight, inner, fill) {
  if (weight === "fill") return toJsx(fill);
  if (weight === "duotone") {
    return `      <g opacity={0.22} fill="currentColor" stroke="none">\n${toJsx(fill, "        ")}\n      </g>\n      <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">\n${toJsx(inner, "        ")}\n      </g>`;
  }
  return toJsx(inner);
}

// ---------------------------------------------------------------------------
// Vue (SFC, one file per weight)
// ---------------------------------------------------------------------------
function vueComponent(weight, inner, fill) {
  return `<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number | string }>(), { size: 24 });
</script>

<template>
  <svg ${vueSvgAttrs(weight)}>
${vueBody(weight, inner, fill)}
  </svg>
</template>
`;
}

function vueSvgAttrs(weight) {
  const parts = [
    'xmlns="http://www.w3.org/2000/svg"',
    'viewBox="0 0 24 24"',
    ':width="props.size"',
    ':height="props.size"',
  ];
  if (weight === "fill") {
    parts.push('fill="currentColor"');
  } else {
    parts.push('fill="none"', 'stroke="currentColor"');
    if (STROKE[weight]) parts.push(`stroke-width="${STROKE[weight]}"`);
    parts.push('stroke-linecap="round"', 'stroke-linejoin="round"');
  }
  parts.push('aria-hidden="true"');
  return parts.join(" ");
}

function vueBody(weight, inner, fill) {
  if (weight === "fill") return indentSvg(fill, 4);
  if (weight === "duotone") {
    return `    <g opacity="0.22" fill="currentColor" stroke="none">\n${indentSvg(fill, 6)}\n    </g>\n    <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">\n${indentSvg(inner, 6)}\n    </g>`;
  }
  return indentSvg(inner, 4);
}

// ---------------------------------------------------------------------------
// Svelte (one component per weight)
// ---------------------------------------------------------------------------
function svelteComponent(weight, inner, fill) {
  return `<script lang="ts">
  let { size = 24 }: { size?: number | string } = $props();
</script>

<svg ${svelteSvgAttrs(weight)}>
${svelteBody(weight, inner, fill)}
</svg>
`;
}

function svelteSvgAttrs(weight) {
  const parts = [
    'xmlns="http://www.w3.org/2000/svg"',
    'viewBox="0 0 24 24"',
    "width={size}",
    "height={size}",
  ];
  if (weight === "fill") {
    parts.push('fill="currentColor"');
  } else {
    parts.push('fill="none"', 'stroke="currentColor"');
    if (STROKE[weight]) parts.push(`stroke-width="${STROKE[weight]}"`);
    parts.push('stroke-linecap="round"', 'stroke-linejoin="round"');
  }
  parts.push('aria-hidden="true"');
  return parts.join(" ");
}

function svelteBody(weight, inner, fill) {
  if (weight === "fill") return indentSvg(inner, 2);
  if (weight === "duotone") {
    return `  <g opacity="0.22" fill="currentColor" stroke="none">\n${indentSvg(fill, 4)}\n  </g>\n  <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">\n${indentSvg(inner, 4)}\n  </g>`;
  }
  return indentSvg(inner, 2);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  const target = process.argv[2] || "all";
  const want = (fw) => target === "all" || target === fw;

  const { icons: batchIcons, fills: batchFills } = await loadBatches();
  const icons = { ...ORIGINAL_ICONS, ...batchIcons };
  const fills = { ...ORIGINAL_FILLS, ...batchFills };
  const names = Object.keys(icons).sort().filter((n) => icons[n] && pascal(n));

  const pkgRoot = path.join(repoRoot, "packages");

  if (want("react")) {
    const reactSrc = path.join(pkgRoot, "icons-react", "src");
    const dir = path.join(reactSrc, "icons");
    const aggregateDir = path.join(reactSrc, "aggregate");
    await rm(dir, { recursive: true, force: true });
    await rm(aggregateDir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    await mkdir(aggregateDir, { recursive: true });
    const barrel = [];
    for (const name of names) {
      const inner = icons[name];
      const fill = fills[name] ?? inner;
      const component = pascal(name);
      await writeFile(path.join(aggregateDir, `${name}.tsx`), reactComponent(component, inner, fill), "utf8");
      const iconDir = path.join(dir, name);
      await mkdir(iconDir, { recursive: true });
      const weightBarrel = [];
      for (const weight of WEIGHTS) {
        const exportName = iconName(component, weight);
        await writeFile(
          path.join(iconDir, `${weight}.tsx`),
          reactWeightComponent(exportName, weight, inner, fill),
          "utf8",
        );
        weightBarrel.push(`export { ${exportName} } from "./${weight}";`);
      }
      await writeFile(path.join(iconDir, "index.ts"), weightBarrel.join("\n") + "\n", "utf8");
      barrel.push(
        `export { ${WEIGHTS.map((w) => iconName(component, w)).join(", ")} } from "./aggregate/${name}";`,
      );
    }
    await writeFile(path.join(reactSrc, "index.ts"), barrel.join("\n") + "\n", "utf8");
  }

  if (want("vue")) {
    const dir = path.join(pkgRoot, "icons-vue", "src", "icons");
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    const barrel = [];
    for (const name of names) {
      const inner = icons[name];
      const fill = fills[name] ?? inner;
      const component = pascal(name);
      for (const weight of WEIGHTS) {
        const file = weight === "regular" ? `${name}.vue` : `${name}-${weight}.vue`;
        await writeFile(path.join(dir, file), vueComponent(weight, inner, fill), "utf8");
      }
      barrel.push(
        WEIGHTS.map((w) => {
          const file = w === "regular" ? `${name}.vue` : `${name}-${w}.vue`;
          return `export { default as ${iconName(component, w)} } from "./icons/${file}";`;
        }).join("\n"),
      );
    }
    await writeFile(path.join(pkgRoot, "icons-vue", "src", "index.ts"), barrel.join("\n") + "\n", "utf8");
  }

  if (want("svelte")) {
    const dir = path.join(pkgRoot, "icons-svelte", "src", "icons");
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    const barrel = [];
    for (const name of names) {
      const inner = icons[name];
      const fill = fills[name] ?? inner;
      const component = pascal(name);
      for (const weight of WEIGHTS) {
        const file = weight === "regular" ? `${name}.svelte` : `${name}-${weight}.svelte`;
        await writeFile(path.join(dir, file), svelteComponent(weight, inner, fill), "utf8");
      }
      barrel.push(
        WEIGHTS.map((w) => {
          const file = w === "regular" ? `${name}.svelte` : `${name}-${w}.svelte`;
          return `export { default as ${iconName(component, w)} } from "./icons/${file}";`;
        }).join("\n"),
      );
    }
    await writeFile(path.join(pkgRoot, "icons-svelte", "src", "index.ts"), barrel.join("\n") + "\n", "utf8");
  }

  console.log(`Generated ${names.length} icons → ${target}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
