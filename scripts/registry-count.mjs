/**
 * Counts registry items for `apps/web/src/projects/counts.ts`.
 *
 * The LANDING page must NOT import the registries — importing them pulls the
 * entire UI kit (~2k modules) into the main bundle. So instead the landing
 * page reads precomputed counts from counts.ts, and this script keeps those
 * numbers honest. Run after editing any docs/registry*.tsx:
 *
 *   node scripts/registry-count.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const web = path.resolve(__dirname, "..", "apps", "web", "src", "docs");

const FILES = [
  "registry.tsx",
  "registry-core.tsx",
  "registry-extra.tsx",
  "registry-marketing.tsx",
  "registry-optionA.tsx",
  "registry-dashboards.tsx",
];

/** Strip comments, template literals and long strings so object-shape code
 *  survives (code samples can otherwise corrupt brace matching). */
function clean(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/(^|[^:])\/\/(?!\/).*$/gm, "$1") // line comments
    .replace(/`(?:[^\\`]|\\.)*`/gs, "") // template literals
    .replace(/"([^"\\]|\\.)*"/g, (m) => (m.length > 60 ? '""' : m)); // long strings
}

/** Number of `{ id: "..." }` objects nested directly inside an `items: [...]`. */
function countItems(src) {
  const ids = [];
  let i = 0;
  while (i < src.length) {
    const start = src.indexOf("items: [", i);
    if (start === -1) break;
    // Walk to the matching `]`, tracking brace depth so nested objects are skipped.
    let depth = 0;
    let j = start + "items: [".length;
    let blockEnd = -1;
    for (; j < src.length; j++) {
      const c = src[j];
      if (c === "[") depth++;
      else if (c === "]") {
        depth--;
        if (depth === 0) {
          blockEnd = j;
          break;
        }
      }
    }
    if (blockEnd === -1) break;
    const block = src.slice(start, blockEnd + 1);
    // Top-level objects in the items array — they always open with `{ id:`.
    for (const m of block.matchAll(/\n?\s*\{\s*id:\s*"([^"]*)"/g)) {
      ids.push(m[1]);
    }
    i = blockEnd + 1;
  }
  return ids;
}

const countsPerFile = {};
const allIds = [];

for (const f of FILES) {
  const src = fs.readFileSync(path.join(web, f), "utf8");
  allIds.push(...countItems(clean(src)));
}

const components = allIds.filter((id) => !id.startsWith("dashboard-"));
const dashboards = allIds.filter((id) => id.startsWith("dashboard-"));

const dupes = components.filter((id, idx) => components.indexOf(id) !== idx);
console.log(`component items: ${components.length}`);
console.log(`dashboard items: ${dashboards.length}`);
console.log("duplicate ids:", dupes.length ? [...new Set(dupes)] : "none");