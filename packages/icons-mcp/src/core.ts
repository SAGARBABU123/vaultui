/**
 * Shared icon query engine for the MCP server.
 *
 * Pure and transport-agnostic: the Cloudflare Worker and the stdio CLI both
 * build a core from the generated index and inject their own SVG shard loader.
 */

export interface IconRecord {
  name: string;
  category: string;
  tags: string[];
  aliases: string[];
  letter: string;
}

export interface CategoryRecord {
  id: string;
  label: string;
  blurb: string;
  count: number;
}

export interface McpIndex {
  generatedAt: string;
  total: number;
  weights: string[];
  categories: CategoryRecord[];
  icons: IconRecord[];
}

export type SvgShard = Record<string, string>;
export type ShardLoader = (weight: string, letter: string) => Promise<SvgShard>;

export interface SearchInput {
  query: string;
  category?: string;
  limit?: number;
  cursor?: string;
}

export interface SearchHit {
  name: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  aliases: string[];
  pageUrl: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  nextCursor: string | null;
}

export interface IconMeta extends IconRecord {
  categoryLabel: string;
  pageUrl: string;
}

export interface IconResult {
  name: string;
  category: string;
  categoryLabel: string;
  weight: string;
  format: string;
  svg: string;
  importLine: string | null;
  usage: string;
  license: string;
  pageUrl: string;
}

export interface Core {
  index: McpIndex;
  readonly siteUrl: string;
  search(input: SearchInput): Page<SearchHit>;
  list(input: { category?: string; limit?: number; offset?: number }): Page<IconMeta>;
  categories(): CategoryRecord[];
  get(name: string): IconMeta | null;
  render(input: {
    name: string;
    weight: string;
    format: string;
    size?: number;
    color?: string;
  }): Promise<IconResult>;
}

export const WEIGHT_SUFFIX: Record<string, string> = {
  thin: "Thin",
  light: "Light",
  regular: "",
  bold: "Bold",
  fill: "Fill",
  duotone: "Duotone",
};

export const DEFAULT_SITE = "https://icons.abhayaui.workers.dev";
export const LICENSE =
  "MIT (Vault UI). Original geometry; generated from Phosphor Icons (MIT) — see THIRD-PARTY.md.";

const PACKAGE_BY_FORMAT: Record<string, string> = {
  react: "@vaultui/icons-react",
  vue: "@vaultui/icons-vue",
  svelte: "@vaultui/icons-svelte",
};

export function pascal(name: string): string {
  return name
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join("");
}

export function componentName(name: string, weight: string): string {
  return `${pascal(name)}${WEIGHT_SUFFIX[weight] ?? ""}`;
}

function tokensOf(query: string): string[] {
  return query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function scoreIcon(icon: IconRecord, tokens: string[]): number {
  const name = icon.name.toLowerCase();
  const tags = icon.tags.map((tag) => tag.toLowerCase());
  const aliases = icon.aliases.map((alias) => alias.toLowerCase());
  let total = 0;

  for (const token of tokens) {
    let best = 0;
    if (name === token) best = Math.max(best, 120);
    else if (name.startsWith(token)) best = Math.max(best, 90);
    else if (name.includes(token)) best = Math.max(best, 70);

    for (const alias of aliases) {
      if (alias === token) best = Math.max(best, 80);
      else if (alias.includes(token)) best = Math.max(best, 50);
    }
    for (const tag of tags) {
      if (tag === token) best = Math.max(best, 60);
      else if (tag.includes(token)) best = Math.max(best, 35);
    }

    if (best === 0) return 0;
    total += best;
  }

  return total - Math.min(10, name.length);
}

export function createCore(index: McpIndex, loader: ShardLoader, siteUrl = DEFAULT_SITE): Core {
  const byName = new Map<string, IconRecord>();
  const aliasMap = new Map<string, string>();
  const categoryLabel = new Map<string, string>();
  const svgCache = new Map<string, SvgShard>();

  for (const category of index.categories) categoryLabel.set(category.id, category.label);
  for (const icon of index.icons) {
    byName.set(icon.name, icon);
    for (const alias of icon.aliases) if (!aliasMap.has(alias)) aliasMap.set(alias, icon.name);
  }

  function metaOf(icon: IconRecord): IconMeta {
    return {
      ...icon,
      categoryLabel: categoryLabel.get(icon.category) ?? icon.category,
      pageUrl: `${siteUrl}/icons/${icon.name}`,
    };
  }

  function resolve(name: string): IconRecord | undefined {
    const key = name.trim().toLowerCase();
    return byName.get(key) ?? byName.get(aliasMap.get(key) ?? "");
  }

  function validateCategory(category?: string): string | undefined {
    if (!category || category === "all") return undefined;
    if (!categoryLabel.has(category)) {
      throw new Error(
        `Unknown category "${category}". Call list_categories to see valid ids.`,
      );
    }
    return category;
  }

  async function loadShard(weight: string, letter: string): Promise<SvgShard> {
    const key = `${weight}/${letter}`;
    const cached = svgCache.get(key);
    if (cached) return cached;
    const shard = await loader(weight, letter);
    svgCache.set(key, shard);
    return shard;
  }

  function search(input: SearchInput): Page<SearchHit> {
    const query = input.query.trim();
    if (!query) throw new Error("query cannot be empty");
    const category = validateCategory(input.category);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 50);
    const offset = Math.max(Number.parseInt(input.cursor ?? "0", 10) || 0, 0);
    const tokens = tokensOf(query);

    const scored: { icon: IconRecord; score: number }[] = [];
    for (const icon of index.icons) {
      if (category && icon.category !== category) continue;
      const score = scoreIcon(icon, tokens);
      if (score > 0) scored.push({ icon, score });
    }

    scored.sort((a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name));

    const slice = scored.slice(offset, offset + limit);
    return {
      items: slice.map(({ icon }) => ({
        name: icon.name,
        category: icon.category,
        categoryLabel: categoryLabel.get(icon.category) ?? icon.category,
        tags: icon.tags,
        aliases: icon.aliases,
        pageUrl: `${siteUrl}/icons/${icon.name}`,
      })),
      total: scored.length,
      nextCursor: offset + limit < scored.length ? String(offset + limit) : null,
    };
  }

  function list(input: { category?: string; limit?: number; offset?: number }): Page<IconMeta> {
    const category = validateCategory(input.category);
    const limit = Math.min(Math.max(input.limit ?? 50, 1), 100);
    const offset = Math.max(input.offset ?? 0, 0);

    const filtered = category ? index.icons.filter((icon) => icon.category === category) : index.icons;
    return {
      items: filtered.slice(offset, offset + limit).map(metaOf),
      total: filtered.length,
      nextCursor: offset + limit < filtered.length ? String(offset + limit) : null,
    };
  }

  function categories(): CategoryRecord[] {
    return index.categories;
  }

  function get(name: string): IconMeta | null {
    const icon = resolve(name);
    return icon ? metaOf(icon) : null;
  }

  async function render(input: {
    name: string;
    weight: string;
    format: string;
    size?: number;
    color?: string;
  }): Promise<IconResult> {
    const icon = resolve(input.name);
    if (!icon) {
      throw new Error(
        `Unknown icon "${input.name}". Call search_icons with a concept (for example "home") and use the returned canonical name.`,
      );
    }
    const weight = input.weight || "regular";
    if (!index.weights.includes(weight)) {
      throw new Error(`Unknown weight "${weight}". Use one of: ${index.weights.join(", ")}.`);
    }
    const format = input.format || "svg";
    if (!["svg", "react", "vue", "svelte", "html"].includes(format)) {
      throw new Error(`Unknown format "${format}". Use svg, react, vue, svelte or html.`);
    }

    const shard = await loadShard(weight, icon.letter);
    let svg = shard[icon.name];
    if (!svg) throw new Error(`SVG missing for "${icon.name}" (${weight}). The build may be stale.`);

    if (input.size) {
      const size = Math.min(Math.max(Math.round(input.size), 8), 256);
      svg = svg.replace(/<svg\b/, `<svg width="${size}" height="${size}"`);
    }
    if (input.color) {
      const color = input.color.trim();
      if (!/^(currentColor|#[0-9a-f]{3,8})$/i.test(color)) {
        throw new Error('color must be "currentColor" or a hex value like "#4f46e5".');
      }
      svg = svg.split("currentColor").join(color);
    }

    const component = componentName(icon.name, weight);
    const pkg = PACKAGE_BY_FORMAT[format];
    const importLine = pkg
      ? format === "react"
        ? `import { ${component} } from "${pkg}";`
        : `import ${component} from "${pkg}/icons/${icon.name}/${weight}";`
      : null;

    let usage: string;
    if (format === "react") usage = `<${component} size={24} />`;
    else if (format === "vue") usage = `<${component} :size="24" />`;
    else if (format === "svelte") usage = `<${component} size={24} />`;
    else usage = svg;

    return {
      name: icon.name,
      category: icon.category,
      categoryLabel: categoryLabel.get(icon.category) ?? icon.category,
      weight,
      format,
      svg,
      importLine,
      usage,
      license: LICENSE,
      pageUrl: `${siteUrl}/icons/${icon.name}`,
    };
  }

  return { index, siteUrl, search, list, categories, get, render };
}
