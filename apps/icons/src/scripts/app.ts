/**
 * Vault Icons — client island.
 *
 * One small script powers four behaviours and nothing else:
 *   1. fuzzy search across name + tags + category
 *   2. a windowed (virtualized) grid over 1,512 icons
 *   3. weight switching with lazily fetched SVG shards
 *   4. the icon modal with React / Vue / Svelte / HTML snippets
 *
 * SVGs are fetched per-weight, per-letter (≈30 KB shards) and cached in memory,
 * so the initial page stays static HTML with zero framework runtime.
 */

type Category = { id: string; label: string; blurb: string; count: number };
type Catalog = {
  weights: string[];
  categories: Category[];
  total: number;
  icons: [string, number, string, string?][];
};
type Icon = { name: string; category: number; tags: string; aliases: string[] };

const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string) =>
  [...document.querySelectorAll<T>(selector)];

const grid = $("#icon-grid") as HTMLElement;
const scroller = $("#main") as HTMLElement;
const searchInput = $("#search") as HTMLInputElement;
const resultCount = $("#result-count") as HTMLElement | null;
const viewTitle = $("#view-title") as HTMLElement;
const viewDesc = $("#view-desc") as HTMLElement;
const emptyState = $("#empty-state") as HTMLElement;
const modal = $("#icon-modal") as HTMLElement;
const toast = $("[data-toast]") as HTMLElement;
const weightTrigger = $("#weight-trigger") as HTMLButtonElement | null;
const weightMenu = $("#weight-menu") as HTMLElement | null;
const selectToggle = $("#select-toggle") as HTMLButtonElement | null;
const selectBar = $("#select-bar") as HTMLElement | null;

const state = {
  catalog: null as Catalog | null,
  weight: "regular",
  category: "all",
  query: "",
  items: [] as Icon[],
  all: [] as Icon[],
  modalName: "",
  modalWeight: "regular",
  modalSize: 48,
  lang: "react" as "react" | "vue" | "svelte" | "html",
  pm: "npm" as "npm" | "yarn" | "pnpm" | "bun",
  lastFocus: null as HTMLElement | null,
  selectionMode: false,
  selected: new Set<string>(),
  selectLang: "react" as "react" | "vue" | "svelte",
  selectPm: "npm" as "npm" | "yarn" | "pnpm" | "bun",
  iconColor: "",
};

const layout = { cols: 1, tile: 104, tileH: 84, gap: 12, rowH: 96 };
const shardCache = new Map<string, Record<string, string>>();
const shardLoading = new Map<string, Promise<Record<string, string>>>();
let rafToken = 0;
let searchTimer = 0;
let mounted = false;
let loadErrorAnnounced = false;

/* ---------------------------------------------------------------- helpers */

const letterOf = (name: string) => (/[a-z]/i.test(name[0]) ? name[0].toLowerCase() : "_");

const pascal = (name: string) =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const PACKAGES: Record<string, string> = {
  react: "@vaultui/icons-react",
  vue: "@vaultui/icons-vue",
  svelte: "@vaultui/icons-svelte",
};

const INSTALLERS: Record<"npm" | "yarn" | "pnpm" | "bun", string> = {
  npm: "npm i",
  yarn: "yarn add",
  pnpm: "pnpm add",
  bun: "bun add",
};

const WEIGHT_SUFFIX: Record<string, string> = {
  thin: "Thin",
  light: "Light",
  regular: "",
  bold: "Bold",
  fill: "Fill",
  duotone: "Duotone",
};

function deepImportLine(lang: "react" | "vue" | "svelte", name: string, weight: string): string {
  const component = `${pascal(name)}${WEIGHT_SUFFIX[weight] ?? ""}`;
  const target = `${PACKAGES[lang]}/icons/${name}/${weight}`;
  return lang === "react"
    ? `import { ${component} } from "${target}";`
    : `import ${component} from "${target}";`;
}

function installFor(name: string): { command: string; importLine: string } | null {
  const lang = state.lang;
  if (lang === "html") return null;
  const pkg = PACKAGES[lang];
  if (!pkg) return null;
  return {
    command: `${INSTALLERS[state.pm]} ${pkg}`,
    importLine: deepImportLine(lang, name, state.modalWeight),
  };
}

/* ------------------------------------------------------------ selection */

const CART_KEY = "vault-icons:cart";

function selectionInstall(): string {
  const pkg = PACKAGES[state.selectLang];
  return pkg ? `${INSTALLERS[state.selectPm]} ${pkg}` : "";
}

function selectionImport(): string {
  const lang = state.selectLang;
  const pkg = PACKAGES[lang];
  if (!pkg || state.selected.size === 0) return "";
  const weight = state.weight;
  return [...state.selected]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => deepImportLine(lang, name, weight))
    .join("\n");
}

function persistSelection() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify([...state.selected]));
  } catch {
    /* storage unavailable — ignore */
  }
}

/* -------------------------------------------------------------- icon tint */

const COLOR_KEY = "vault-icons:icon-color";

function applyIconColor(color: string) {
  state.iconColor = color;
  const root = document.documentElement;
  if (color) root.style.setProperty("--icon-color", color);
  else root.style.removeProperty("--icon-color");

  const swatch = $("[data-color-swatch]") as HTMLElement | null;
  if (swatch) swatch.style.background = color;

  const input = $("#color-input") as HTMLInputElement | null;
  if (input && color) input.value = color;

  $$("[data-color]").forEach((button) => {
    button.setAttribute("aria-selected", String((button.getAttribute("data-color") || "") === color));
  });
}

function setColorMenu(open: boolean) {
  const menu = $("#color-menu");
  const toggle = $("#color-toggle");
  if (!menu || !toggle) return;
  menu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
}

function saveIconColor(color: string) {
  try {
    if (color) localStorage.setItem(COLOR_KEY, color);
    else localStorage.removeItem(COLOR_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}

/* ---------------------------------------------------------- sidebar rail */

const SIDEBAR_KEY = "vault-icons:sidebar-collapsed";

function setSidebarCollapsed(collapsed: boolean) {
  const shell = document.querySelector(".app-shell");
  const sidebar = $("#sidebar");
  const button = $("[data-sidebar-collapse]");
  shell?.setAttribute("data-sidebar-collapsed", String(collapsed));
  sidebar?.setAttribute("data-collapsed", String(collapsed));
  if (button) {
    button.setAttribute("aria-pressed", String(collapsed));
    button.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
    button.setAttribute("title", collapsed ? "Expand navigation" : "Collapse navigation");
  }
  try {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
  } catch {
    /* storage unavailable — ignore */
  }
}

function updateSelectUi() {
  const count = state.selected.size;

  selectToggle?.setAttribute("aria-pressed", String(state.selectionMode));
  selectToggle?.classList.toggle("is-active", state.selectionMode);
  if (selectToggle) {
    selectToggle.style.background = state.selectionMode ? "var(--color-brand-600)" : "var(--color-surface-0)";
    selectToggle.style.color = state.selectionMode ? "var(--color-surface-0)" : "var(--color-surface-800)";
  }
  const selectLabel = $("[data-select-label]");
  if (selectLabel) selectLabel.textContent = state.selectionMode ? "Selecting…" : "Multi-select";
  const selectHint = $("#select-hint");
  if (selectHint) selectHint.hidden = !state.selectionMode;
  const badge = $("[data-select-badge]");
  if (badge) {
    badge.hidden = count === 0;
    badge.textContent = String(count);
  }

  if (selectBar) selectBar.hidden = !state.selectionMode;

  const countEl = $("[data-select-count]");
  if (countEl) countEl.textContent = String(count);

  const installEl = $("[data-select-install]");
  if (installEl) installEl.textContent = count > 0 ? selectionInstall() : "Select icons to build a command";
  const importEl = $("[data-select-import]");
  if (importEl) importEl.textContent = count > 0 ? selectionImport() : "";

  $$("[data-select-copy-install], [data-select-copy-import]").forEach((button) => {
    (button as HTMLButtonElement).disabled = count === 0;
  });

  $$("[data-select-lang]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.getAttribute("data-select-lang") === state.selectLang));
  });
  $$("[data-select-pm]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.getAttribute("data-select-pm") === state.selectPm));
  });

  grid.setAttribute("data-selecting", String(state.selectionMode));
}

function toggleSelect(name: string) {
  if (state.selected.has(name)) state.selected.delete(name);
  else state.selected.add(name);
  persistSelection();
  updateSelectUi();
  render();
}

function setSelectionMode(on: boolean) {
  state.selectionMode = on;
  updateSelectUi();
  render();
}

function clearSelection() {
  state.selected.clear();
  persistSelection();
  updateSelectUi();
  render();
}

const innerOf = (svg: string) =>
  svg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();

const camel = (attr: string) =>
  attr.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

const jsxInner = (svg: string) =>
  innerOf(svg)
    .replace(/\sclass=/g, " className=")
    .replace(/\s([a-z]+-[a-z-]+)=/g, (_, attr: string) => ` ${camel(attr)}=`);

const viewBoxOf = (svg: string) =>
  /viewBox="([^"]+)"/.exec(svg)?.[1] ?? "0 0 256 256";

const indent = (value: string, spaces: number) =>
  value
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");

function fuzzyScore(query: string, text: string): number {
  if (!query) return 0;
  if (!text) return -1;
  const index = text.indexOf(query);
  if (index === 0) return 120 - Math.min(text.length, 40) * 0.2;
  if (index > 0) return 70 - Math.min(index, 30) * 0.5;
  if (query.length < 5) return -1;

  let ti = 0;
  let qi = 0;
  let gaps = 0;
  let last = -1;
  while (ti < text.length && qi < query.length) {
    if (text[ti] === query[qi]) {
      if (last >= 0) gaps += ti - last - 1;
      last = ti;
      qi += 1;
    }
    ti += 1;
  }
  return qi === query.length ? 36 - gaps : -1;
}

const categoryLabel = (index: number) =>
  state.catalog?.categories[index]?.label.toLowerCase() ?? "";

function scoreIcon(icon: Icon, tokens: string[]): number {
  let total = 0;
  for (const token of tokens) {
    const nameScore = fuzzyScore(token, icon.name);
    const tagScore = fuzzyScore(token, icon.tags);
    const categoryScore = fuzzyScore(token, categoryLabel(icon.category));
    const best = Math.max(nameScore * 1.8, tagScore, categoryScore * 0.7);
    if (best < 0) return -1;
    total += best;
  }
  return total;
}

function interleave(list: Icon[], categories: number): Icon[] {
  const buckets: Icon[][] = Array.from({ length: categories }, () => []);
  for (const icon of list) buckets[icon.category]?.push(icon);
  const output: Icon[] = [];
  for (let index = 0; ; index += 1) {
    let added = false;
    for (const bucket of buckets) {
      if (bucket[index]) {
        output.push(bucket[index]);
        added = true;
      }
    }
    if (!added) break;
  }
  return output;
}

function announce(message: string) {
  toast.textContent = message;
  toast.style.opacity = "1";
  window.setTimeout(() => {
    toast.style.opacity = "0";
  }, 1600);
}

/* ------------------------------------------------------------------ data */

function shardUrl(weight: string, letter: string) {
  return `/data/payload/${weight}/${letter}.json`;
}

function loadShard(weight: string, letter: string): Promise<Record<string, string>> {
  const key = `${weight}/${letter}`;
  const cached = shardCache.get(key);
  if (cached) return Promise.resolve(cached);
  const inFlight = shardLoading.get(key);
  if (inFlight) return inFlight;

  const promise = fetch(shardUrl(weight, letter))
    .then((response) => (response.ok ? response.json() : {}))
    .catch(() => {
      if (!loadErrorAnnounced) {
        loadErrorAnnounced = true;
        announce("Some icons failed to load — check your connection.");
      }
      return {};
    })
    .then((data: Record<string, string>) => {
      shardCache.set(key, data);
      shardLoading.delete(key);
      return data;
    });

  shardLoading.set(key, promise);
  return promise;
}

const svgFor = (name: string, weight: string) =>
  shardCache.get(`${weight}/${letterOf(name)}`)?.[name] ?? "";

/* ---------------------------------------------------------------- layout */

function measure() {
  const styles = getComputedStyle(document.documentElement);
  const tile = Number.parseFloat(styles.getPropertyValue("--tile-size")) || 104;
  const tileH = Number.parseFloat(styles.getPropertyValue("--tile-h")) || tile;
  const gap = Number.parseFloat(styles.getPropertyValue("--tile-gap")) || 12;
  layout.tile = tile;
  layout.tileH = tileH;
  layout.gap = gap;
  layout.rowH = tileH + gap;
  layout.cols = Math.max(1, Math.floor((grid.clientWidth + gap) / (tile + gap)));
}

function gridOffsetTop() {
  return grid.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
}

function render() {
  cancelAnimationFrame(rafToken);
  rafToken = requestAnimationFrame(draw);
}

function draw() {
  if (!mounted) return;
  const total = state.items.length;

  if (total === 0) {
    grid.style.height = "0px";
    grid.replaceChildren();
    return;
  }

  const rows = Math.ceil(total / layout.cols);
  grid.style.height = `${rows * layout.rowH - layout.gap}px`;

  const offset = gridOffsetTop();
  const viewTop = scroller.scrollTop - offset;
  const startRow = Math.max(0, Math.floor(viewTop / layout.rowH) - 2);
  const endRow = Math.min(rows, Math.ceil((viewTop + scroller.clientHeight) / layout.rowH) + 3);

  const contentWidth = layout.cols * layout.tile + (layout.cols - 1) * layout.gap;
  const padLeft = window.innerWidth < 640 ? Math.max(0, (grid.clientWidth - contentWidth) / 2) : 0;

  const fragment = document.createDocumentFragment();

  for (let row = startRow; row < endRow; row += 1) {
    for (let col = 0; col < layout.cols; col += 1) {
      const index = row * layout.cols + col;
      if (index >= total) break;
      const icon = state.items[index];
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "icon-tile";
      tile.dataset.icon = icon.name;
      tile.setAttribute("aria-label", `${icon.name} icon`);
      if (state.selected.has(icon.name)) tile.classList.add("icon-tile--selected");
      tile.style.position = "absolute";
      tile.style.left = `${padLeft + col * (layout.tile + layout.gap)}px`;
      tile.style.top = `${row * layout.rowH}px`;

      const glyph = document.createElement("span");
      glyph.className = "icon-tile__glyph";
      glyph.innerHTML = svgFor(icon.name, state.weight);

      const label = document.createElement("span");
      label.className = "icon-tile__name";
      label.textContent = icon.name;

      tile.append(glyph, label);
      fragment.append(tile);
    }
  }

  grid.replaceChildren(fragment);
  prefetchRange(startRow, endRow);
}

function prefetchRange(startRow: number, endRow: number) {
  const letters = new Set<string>();
  for (let row = startRow; row < endRow; row += 1) {
    for (let col = 0; col < layout.cols; col += 1) {
      const icon = state.items[row * layout.cols + col];
      if (icon) letters.add(letterOf(icon.name));
    }
  }
  const missing = [...letters].filter(
    (letter) => !shardCache.has(`${state.weight}/${letter}`),
  );
  if (missing.length === 0) return;
  grid.setAttribute("aria-busy", "true");
  Promise.all(missing.map((letter) => loadShard(state.weight, letter))).then(() => {
    grid.setAttribute("aria-busy", "false");
    render();
  });
}

/* ----------------------------------------------------------------- apply */

function apply(push = true) {
  if (!state.catalog) return;
  const tokens = state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const categoryIndex = state.catalog.categories.findIndex((c) => c.id === state.category);

  let list = state.all;
  if (categoryIndex >= 0) list = list.filter((icon) => icon.category === categoryIndex);

  if (tokens.length > 0) {
    const scored: { icon: Icon; score: number }[] = [];
    for (const icon of list) {
      const score = scoreIcon(icon, tokens);
      if (score >= 0) scored.push({ icon, score });
    }
    scored.sort((a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name));
    state.items = scored.map((entry) => entry.icon);
  } else {
    state.items = list;
  }

  const activeCategory = state.catalog.categories.find((c) => c.id === state.category);

  if (resultCount) {
    resultCount.textContent = `${state.items.length.toLocaleString()} icon${state.items.length === 1 ? "" : "s"}`;
  }
  emptyState.hidden = state.items.length > 0;
  grid.style.display = state.items.length > 0 ? "" : "none";

  if (tokens.length > 0) {
    viewTitle.textContent = "Search results";
    viewDesc.textContent = `${state.items.length.toLocaleString()} ${state.items.length === 1 ? "icon" : "icons"} matching “${state.query.trim()}”${activeCategory ? ` in ${activeCategory.label}` : ""}.`;
  } else {
    viewTitle.textContent = activeCategory ? activeCategory.label : "All icons";
    viewDesc.textContent = activeCategory
      ? activeCategory.blurb
      : `${state.catalog.total.toLocaleString()} icons across ${state.catalog.categories.length} categories, each in six weights. Click any icon for React, Vue and Svelte snippets.`;
  }

  if (state.items.length === 0) {
    const title = $("#empty-title");
    const copy = $("#empty-copy");
    if (title) title.textContent = `No icons match “${state.query.trim()}”`;
    if (copy)
      copy.textContent =
        "Try a shorter term — names, tags and categories are all searchable. Or browse the full library.";
  }

  if (push) {
    const url = new URL(window.location.href);
    if (state.category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", state.category);
    if (state.query) url.searchParams.set("q", state.query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
  }

  render();
}

function setCategory(id: string) {
  state.category = id;
  $$("[data-category]").forEach((button) => {
    button.setAttribute("aria-current", String(button.getAttribute("data-category") === id));
  });
  scroller.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  apply();
}

function syncWeightUi(weight: string) {
  $$("[data-weight]").forEach((button) => {
    button.setAttribute("aria-selected", String(button.getAttribute("data-weight") === weight));
  });
  const label = $("[data-weight-label]");
  if (label) label.textContent = weight.charAt(0).toUpperCase() + weight.slice(1);
}

function setWeightMenu(open: boolean) {
  if (!weightMenu || !weightTrigger) return;
  weightMenu.hidden = !open;
  weightTrigger.setAttribute("aria-expanded", String(open));
}

function setWeight(weight: string) {
  state.weight = weight;
  syncWeightUi(weight);
  setWeightMenu(false);
  const url = new URL(window.location.href);
  if (weight === "regular") url.searchParams.delete("weight");
  else url.searchParams.set("weight", weight);
  history.replaceState(null, "", url);
  apply(false);
}

/* ---------------------------------------------------------------- modal */

function snippetFor(name: string, svg: string, lang: string): string {
  const component = pascal(name);
  const box = viewBoxOf(svg);
  const inner = jsxInner(svg);
  const htmlInner = innerOf(svg);

  if (lang === "react") {
    return `import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function ${component}({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${box}"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
${indent(inner, 6)}
    </svg>
  );
}`;
  }

  if (lang === "vue") {
    return `<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number | string }>(), { size: 24 });
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="${box}"
    :width="props.size"
    :height="props.size"
    fill="currentColor"
    aria-hidden="true"
  >
${indent(htmlInner, 4)}
  </svg>
</template>`;
  }

  if (lang === "svelte") {
    return `<script lang="ts">
  let { size = 24, ...rest }: { size?: number } & Record<string, unknown> = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${box}"
  width={size}
  height={size}
  fill="currentColor"
  aria-hidden="true"
  {...rest}
>
${indent(htmlInner, 2)}
</svg>`;
  }

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${box}"
  width="24"
  height="24"
  fill="currentColor"
  aria-hidden="true"
>
${indent(htmlInner, 2)}
</svg>`;
}

function currentIcon(): Icon | undefined {
  return state.items.find((icon) => icon.name === state.modalName);
}

function paintModal() {
  const icon = currentIcon();
  if (!icon || !state.catalog) return;
  const svg = svgFor(icon.name, state.modalWeight);
  if (!svg) {
    loadShard(state.modalWeight, letterOf(icon.name)).then(() => paintModal());
    return;
  }

  const category = state.catalog.categories[icon.category];
  const gridSize = viewBoxOf(svg).split(/\s+/)[2] ?? "256";
  const title = $("#modal-title");
  const categoryEl = $("#modal-category");
  const gridEl = $("#modal-grid");
  const tags = $("[data-modal-tags]");
  const aliasesEl = $("[data-modal-aliases]") as HTMLElement | null;
  const preview = $("#modal-preview") as HTMLElement | null;
  const code = $("[data-code-output]");

  if (title) title.textContent = icon.name;
  if (categoryEl) categoryEl.textContent = category?.label ?? "";
  if (gridEl) gridEl.textContent = `${gridSize} grid · currentColor`;
  if (tags) tags.textContent = `Tags · ${icon.tags.split(" ").join(" · ")}`;
  if (aliasesEl) {
    if (icon.aliases.length > 0) {
      aliasesEl.hidden = false;
      aliasesEl.textContent = `Also known as · ${icon.aliases.join(" · ")}`;
    } else {
      aliasesEl.hidden = true;
      aliasesEl.textContent = "";
    }
  }
  if (preview) {
    preview.innerHTML = `<span class="icon-modal__frame">${svg}</span>`;
    preview.style.setProperty("--preview-size", `${state.modalSize}px`);
  }
  if (code) code.textContent = snippetFor(icon.name, svg, state.lang);

  const install = installFor(icon.name);
  const installPanel = modal.querySelector<HTMLElement>("[data-install-panel]");
  const installCommand = $("[data-install-command]");
  const importLine = $("[data-import-line]");
  if (installPanel) installPanel.hidden = !install;
  if (installCommand) installCommand.textContent = install?.command ?? "";
  if (importLine) importLine.textContent = install?.importLine ?? "";

  const position = state.items.findIndex((entry) => entry.name === icon.name);
  const positionEl = $("[data-modal-position]");
  if (positionEl) positionEl.textContent = `${position + 1} / ${state.items.length}`;

  const pageLink = modal.querySelector<HTMLAnchorElement>("[data-modal-page]");
  if (pageLink) pageLink.href = `/icons/${icon.name}`;

  $$("[data-modal-weight]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.getAttribute("data-modal-weight") === state.modalWeight));
  });
  $$("[data-modal-size]").forEach((button) => {
    button.setAttribute("aria-checked", String(Number(button.getAttribute("data-modal-size")) === state.modalSize));
  });
  $$("[data-lang]").forEach((button) => {
    button.setAttribute("aria-selected", String(button.getAttribute("data-lang") === state.lang));
  });
  $$("[data-pm]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.getAttribute("data-pm") === state.pm));
  });
}

function showModal(name: string, push: boolean) {
  state.lastFocus = document.activeElement as HTMLElement | null;
  state.modalName = name;
  state.modalWeight = state.weight;
  state.modalSize = 48;
  state.lang = "react";
  setWeightMenu(false);
  modal.hidden = false;
  scroller.style.overflowY = "hidden";
  paintModal();
  const close = modal.querySelector<HTMLElement>("[data-drawer-close]");
  close?.focus();
  if (push) history.pushState({ icon: name }, "", `#${name}`);
}

function hideModal() {
  modal.hidden = true;
  scroller.style.overflowY = "";
  state.lastFocus?.focus();
}

function closeModal() {
  // If this drawer owns a history entry, let Back remove it (so browser Back
  // and the close button behave identically).
  if (history.state?.icon) {
    history.back();
    return;
  }
  hideModal();
  const url = new URL(window.location.href);
  url.hash = "";
  history.replaceState(null, "", url);
}

function openModal(name: string) {
  showModal(name, true);
}

function stepModal(direction: number) {
  const index = state.items.findIndex((icon) => icon.name === state.modalName);
  if (index < 0) return;
  const next = (index + direction + state.items.length) % state.items.length;
  state.modalName = state.items[next].name;
  state.modalWeight = state.weight;
  paintModal();
  history.replaceState({ icon: state.modalName }, "", `#${state.modalName}`);
}

function currentSvg(): string {
  const icon = currentIcon();
  return icon ? svgFor(icon.name, state.modalWeight) : "";
}

function currentSnippet(): string {
  const icon = currentIcon();
  if (!icon) return "";
  const svg = svgFor(icon.name, state.modalWeight);
  return svg ? snippetFor(icon.name, svg, state.lang) : "";
}

async function copyText(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  announce("Copied to clipboard");
  const label = $("[data-copy-label]");
  if (label) {
    const previous = label.textContent;
    label.textContent = "Copied";
    window.setTimeout(() => {
      label.textContent = previous || "Copy";
    }, 1400);
  }
}

const copiedTimers = new WeakMap<HTMLElement, number>();

function flashCopied(button: HTMLElement | null) {
  if (!button) return;
  if (!button.dataset.label) button.dataset.label = button.textContent ?? "Copy";
  const original = button.dataset.label;
  button.textContent = "Copied ✓";
  button.classList.add("is-copied");
  const previous = copiedTimers.get(button);
  if (previous) window.clearTimeout(previous);
  copiedTimers.set(
    button,
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove("is-copied");
      delete button.dataset.label;
      copiedTimers.delete(button);
    }, 1400),
  );
}

function downloadSvg() {
  const icon = currentIcon();
  if (!icon) return;
  const svg = svgFor(icon.name, state.modalWeight);
  if (!svg) return;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${icon.name}-${state.modalWeight}.svg`;
  anchor.click();
  URL.revokeObjectURL(url);
  announce("SVG downloaded");
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== "Tab") return;
  const focusable = [...modal.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hasAttribute("disabled"));
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ----------------------------------------------------------------- wiring */

function wire() {
  selectToggle?.addEventListener("click", () => setSelectionMode(!state.selectionMode));

  $("#color-toggle")?.addEventListener("click", () => {
    const menu = $("#color-menu");
    if (menu) setColorMenu(menu.hidden);
  });
  $$("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.getAttribute("data-color") || "";
      applyIconColor(color);
      saveIconColor(color);
      setColorMenu(false);
    });
  });
  $("#color-input")?.addEventListener("input", (event) => {
    const color = (event.target as HTMLInputElement).value;
    applyIconColor(color);
    saveIconColor(color);
  });
  $("#color-reset")?.addEventListener("click", () => {
    applyIconColor("");
    saveIconColor("");
    setColorMenu(false);
  });
  $("[data-sidebar-collapse]")?.addEventListener("click", () => {
    const sidebar = $("#sidebar");
    setSidebarCollapsed(sidebar?.getAttribute("data-collapsed") !== "true");
  });
  document.addEventListener("click", (event) => {
    if (!(event.target as Element).closest("#color-picker")) setColorMenu(false);
  });

  $$("[data-select-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-select-lang");
      if (lang === "react" || lang === "vue" || lang === "svelte") {
        state.selectLang = lang;
        updateSelectUi();
      }
    });
  });

  $$("[data-select-pm]").forEach((button) => {
    button.addEventListener("click", () => {
      const pm = button.getAttribute("data-select-pm");
      if (pm === "npm" || pm === "yarn" || pm === "pnpm" || pm === "bun") {
        state.selectPm = pm;
        updateSelectUi();
      }
    });
  });

  $("[data-select-clear]")?.addEventListener("click", clearSelection);
  $("[data-select-done]")?.addEventListener("click", () => setSelectionMode(false));
  const copyInstallBtn = $("[data-select-copy-install]") as HTMLButtonElement | null;
  const copyImportBtn = $("[data-select-copy-import]") as HTMLButtonElement | null;
  copyInstallBtn?.addEventListener("click", () => {
    if (state.selected.size === 0) return;
    copyText(selectionInstall());
    flashCopied(copyInstallBtn);
  });
  copyImportBtn?.addEventListener("click", () => {
    if (state.selected.size === 0) return;
    copyText(selectionImport());
    flashCopied(copyImportBtn);
  });

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => apply(), 90);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      state.query = "";
      apply();
      searchInput.blur();
    }
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;

    if ((event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) && !typing) {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }

    if (weightMenu && !weightMenu.hidden) {
      if (event.key === "Escape") {
        setWeightMenu(false);
        weightTrigger?.focus();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const options = [...weightMenu.querySelectorAll<HTMLElement>("[data-weight]")];
        if (options.length > 0) {
          const current = options.indexOf(document.activeElement as HTMLElement);
          const next =
            event.key === "ArrowDown"
              ? (current + 1) % options.length
              : current <= 0
                ? options.length - 1
                : current - 1;
          options[next].focus();
        }
        return;
      }
    }

    if (!modal.hidden) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      } else if (event.key === "ArrowRight" && !typing) {
        stepModal(1);
      } else if (event.key === "ArrowLeft" && !typing) {
        stepModal(-1);
      }
      trapFocus(event);
      return;
    }

    if (event.key === "Escape" && state.selectionMode) {
      setSelectionMode(false);
      return;
    }

    if (event.key === "Escape" && $("#sidebar")?.getAttribute("data-open") === "true") {
      closeSidebar();
    }
  });

  $$("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-category") || "all";
      setCategory(id);
      closeSidebar();
    });
  });

  $$("[data-weight]").forEach((button) => {
    button.addEventListener("click", () => {
      const weight = button.getAttribute("data-weight");
      if (weight) setWeight(weight);
    });
  });

  weightTrigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    setWeightMenu(Boolean(weightMenu?.hidden));
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (weightMenu && !weightMenu.hidden && !target.closest("[data-weight-control]")) {
      setWeightMenu(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (!modal.hidden) {
      if (target.closest("[data-modal-close]") || target.closest("[data-drawer-close]")) {
        closeModal();
        return;
      }
      if (target.closest("[data-modal-prev]")) {
        stepModal(-1);
        return;
      }
      if (target.closest("[data-modal-next]")) {
        stepModal(1);
        return;
      }
      if (target.closest("[data-modal-copy]")) {
        copyText(currentSnippet());
        return;
      }
      if (target.closest("[data-modal-copy-svg]")) {
        copyText(currentSvg());
        return;
      }
      if (target.closest("[data-modal-copy-name]")) {
        copyText(state.modalName);
        return;
      }
      if (target.closest("[data-modal-download]")) {
        downloadSvg();
        return;
      }
      const weightButton = target.closest<HTMLElement>("[data-modal-weight]");
      if (weightButton) {
        const weight = weightButton.getAttribute("data-modal-weight");
        if (weight) {
          state.modalWeight = weight;
          paintModal();
        }
        return;
      }
      const sizeButton = target.closest<HTMLElement>("[data-modal-size]");
      if (sizeButton) {
        state.modalSize = Number(sizeButton.getAttribute("data-modal-size")) || 48;
        paintModal();
        return;
      }
      const langButton = target.closest<HTMLElement>("[data-lang]");
      if (langButton) {
        state.lang = (langButton.getAttribute("data-lang") as typeof state.lang) || "react";
        paintModal();
        return;
      }
      const pmButton = target.closest<HTMLElement>("[data-pm]");
      if (pmButton) {
        state.pm = (pmButton.getAttribute("data-pm") as typeof state.pm) || "npm";
        paintModal();
        return;
      }
      const installBtn = target.closest<HTMLElement>("[data-modal-copy-install]");
      if (installBtn) {
        const install = installFor(state.modalName);
        if (install) copyText(install.command);
        flashCopied(installBtn);
        return;
      }
      const importBtn = target.closest<HTMLElement>("[data-modal-copy-import]");
      if (importBtn) {
        const install = installFor(state.modalName);
        if (install) copyText(install.importLine);
        flashCopied(importBtn);
        return;
      }
    }

    const iconTile = target.closest<HTMLElement>("[data-icon]");
    if (iconTile && grid.contains(iconTile)) {
      const name = iconTile.getAttribute("data-icon");
      if (!name) return;
      if (state.selectionMode) toggleSelect(name);
      else openModal(name);
      return;
    }

    if (target.closest("[data-clear-search]")) {
      searchInput.value = "";
      state.query = "";
      apply();
      searchInput.focus();
      return;
    }

    if (target.closest("[data-browse-all]")) {
      searchInput.value = "";
      state.query = "";
      setCategory("all");
      return;
    }

    if (target.closest("[data-sidebar-open]")) {
      openSidebar();
      return;
    }

    if (target.closest("[data-sidebar-close]") || target.matches("[data-sidebar-backdrop]")) {
      closeSidebar();
    }
  });

  window.addEventListener("popstate", () => {
    const name = window.location.hash.replace("#", "");
    if (name && state.items.some((icon) => icon.name === name)) {
      if (modal.hidden) showModal(name, false);
      else {
        state.modalName = name;
        paintModal();
      }
    } else if (!modal.hidden) {
      hideModal();
    }
  });

  grid.addEventListener("keydown", (event) => {
    const tile = (event.target as HTMLElement).closest<HTMLElement>("[data-icon]");
    const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!tile || !keys.includes(event.key)) return;

    const index = state.items.findIndex((icon) => icon.name === tile.dataset.icon);
    if (index < 0) return;

    const delta =
      event.key === "ArrowRight" ? 1
      : event.key === "ArrowLeft" ? -1
      : event.key === "ArrowDown" ? layout.cols
      : event.key === "ArrowUp" ? -layout.cols
      : 0;

    const next =
      event.key === "Home" ? 0
      : event.key === "End" ? state.items.length - 1
      : index + delta;

    if (next < 0 || next >= state.items.length) return;
    event.preventDefault();

    const row = Math.floor(next / layout.cols);
    const top = gridOffsetTop() + row * layout.rowH;
    if (top < scroller.scrollTop + 8 || top + layout.rowH > scroller.scrollTop + scroller.clientHeight - 8) {
      scroller.scrollTop = Math.max(0, top - layout.rowH);
    }

    render();
    const name = state.items[next].name;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid
          .querySelector<HTMLElement>(`[data-icon="${CSS.escape(name)}"]`)
          ?.focus({ preventScroll: true });
      });
    });
  });

  scroller.addEventListener("scroll", render, { passive: true });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      measure();
      render();
    }, 120);
  });
}

function openSidebar() {
  $("#sidebar")?.setAttribute("data-open", "true");
  $("[data-sidebar-backdrop]")?.setAttribute("data-open", "true");
}

function closeSidebar() {
  $("#sidebar")?.setAttribute("data-open", "false");
  $("[data-sidebar-backdrop]")?.setAttribute("data-open", "false");
}

/* ------------------------------------------------------------------- boot */

async function boot() {
  let catalog: Catalog;
  try {
    catalog = await fetch("/data/catalog.json").then((response) => response.json());
  } catch {
    announce("Search is unavailable offline — showing the static set.");
    return;
  }

  state.catalog = catalog;

  try {
    const savedColor = localStorage.getItem(COLOR_KEY);
    if (savedColor) applyIconColor(savedColor);
  } catch {
    /* storage unavailable — ignore */
  }

  try {
    if (localStorage.getItem(SIDEBAR_KEY) === "1") setSidebarCollapsed(true);
  } catch {
    /* storage unavailable — ignore */
  }
  state.all = interleave(
    catalog.icons.map(([name, category, tags, aliases]) => ({
      name,
      category,
      tags,
      aliases: aliases ? aliases.split(" ").filter(Boolean) : [],
    })),
    catalog.categories.length,
  );

  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (Array.isArray(saved)) {
      const valid = new Set(state.all.map((icon) => icon.name));
      for (const name of saved) {
        if (typeof name === "string" && valid.has(name)) state.selected.add(name);
      }
    }
  } catch {
    /* ignore corrupt cart */
  }

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const query = params.get("q");
  const weight = params.get("weight");
  if (weight && catalog.weights.includes(weight)) {
    state.weight = weight;
    syncWeightUi(weight);
  }
  if (category && catalog.categories.some((entry) => entry.id === category)) {
    state.category = category;
    $$("[data-category]").forEach((button) => {
      button.setAttribute("aria-current", String(button.getAttribute("data-category") === category));
    });
  }
  if (query) {
    state.query = query;
    searchInput.value = query;
  }

  state.items = state.all;
  measure();

  const firstRows = Math.ceil(scroller.clientHeight / layout.rowH) + 2;
  const letters = new Set<string>();
  for (let row = 0; row < firstRows; row += 1) {
    for (let col = 0; col < layout.cols; col += 1) {
      const icon = state.items[row * layout.cols + col];
      if (icon) letters.add(letterOf(icon.name));
    }
  }
  await Promise.all([...letters].map((letter) => loadShard(state.weight, letter)));

  grid.removeAttribute("data-static");
  mounted = true;
  apply(false);
  wire();
  updateSelectUi();

  const hash = window.location.hash.replace("#", "");
  if (hash && state.items.some((icon) => icon.name === hash)) {
    showModal(hash, false);
  }
}

boot();
