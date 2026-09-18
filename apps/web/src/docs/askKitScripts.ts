import { ALL_GROUPS, DASHBOARDS } from "../projects/entries";

/**
 * "Ask the Kit" — layer 1: scripted intents (deterministic, no AI).
 *
 * Every answer comes straight from the registry / FAQ content, so it is
 * instant, free and hallucination-proof. Anything returning null falls
 * through to the Gemini fallback (layer 2, see AskTheKit.tsx).
 */

export type ScriptHit = { body: string; code?: string };

function normalized(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function wordsOf(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((w) => w.length >= 4);
}

export function scriptedAnswer(raw: string): ScriptHit | null {
  const q = raw.trim().toLowerCase();
  if (!q) return null;
  const nq = normalized(q);
  const words = wordsOf(q);
  const entries = ALL_GROUPS.flatMap((g) => g.items).filter((e) => e.id !== "overview");

  // A) Direct component mention → exact registry answer (name/id inside the
  //    sentence). Strong, specific — checked first.
  const exactHit = entries.find((e) => {
    const name = normalized(e.name);
    const id = normalized(e.id);
    return (name.length >= 4 && nq.includes(name)) || (id.length >= 3 && nq.includes(id));
  });
  if (exactHit) {
    return {
      body: exactHit.description,
      code: `import ${exactHit.importName} from "${exactHit.package}";\n\n${exactHit.usage}`,
    };
  }

  // A2) Explicit kit/group mention → catalog of that kit ("what's inside the
  //     data viz kit" should list the kit, not one component).
  const group = ALL_GROUPS.find((g) => {
    const gn = normalized(g.group);
    if (gn.length >= 4 && nq.includes(gn)) return true;
    return wordsOf(g.group).some((t) => q.includes(t));
  });
  if (group) {
    const names = group.items.filter((i) => i.id !== "overview").map((i) => i.name);
    return {
      body: `${group.group} — ${names.length} components:\n${names.join(", ")}`,
      code: "npx vault-ui init\n# browse /docs to preview and add components",
    };
  }

  // B) Keyword scripts — answers straight from the docs/FAQ content.
  if (/\b(install|setup|get started|get\s?started|download|package|npm|pnpm)\b/.test(q)) {
    return {
      body: "Add a component with the CLI, or install the package:",
      code: "npx vault-ui add switch modal toast\n\n# or via any manager — npm i / yarn add / pnpm add / bun add\nnpm i @vaultui/ui @vaultui/tokens",
    };
  }
  if (/\b(cli|command line)\b/.test(q)) {
    return {
      body: "The vault-ui CLI inits the theme and adds components straight into your project:",
      code: "npx vault-ui init\nnpx vault-ui add data-table combobox",
    };
  }
  if (/\b(theme|themes|styling|rebrand|colour|color|css|token)\b/.test(q)) {
    return {
      body: "Everything reads CSS variables. Four themes ship: Neumorphic (default), Glassmorphism, Dimensional Layering and Vintage Retro Film. Override the variables to re-brand — try the Rebrand Lab at /lab.",
      code: 'html[data-theme="glassmorphism"] {\n  --color-brand-600: #0068d6;\n}',
    };
  }
  if (/\b(license|licence|mit|commercial|source)\b/.test(q)) {
    return {
      body: "Core components are MIT on the public registry. Premium kits (AI, Data Viz, Commerce, Dev Tools, Project, Collab, Marketing) ship under a single commercial license covering all kits, source included.",
    };
  }
  if (/\b(pricing|price|cost|how much|upgrade|premium|paid|subscription|free\b)/.test(q)) {
    return {
      body: "Free core forever — MIT on the public registry, no account needed to use them. Premium kits ship under a single commercial license covering all kits, source included — the demo upgrade in the app flips instantly.",
    };
  }
  // C) Weak word-token match — "shows my data tables" hits DataTable via
  //     the "table" token; plurals and loose phrasing land here.
  const looseHit = entries.find((e) => {
    const name = normalized(e.name);
    const id = normalized(e.id);
    return words.some((w) => name.includes(w) || id.includes(w));
  });
  if (looseHit) {
    return {
      body: looseHit.description,
      code: `import ${looseHit.importName} from "${looseHit.package}";\n\n${looseHit.usage}`,
    };
  }

  // D) Generic catalog question → overview of everything in the vault.
  if (/\b(component|components|kit|kits|dashboard|dashboards|vault)\b/.test(q)) {
    const kits = ALL_GROUPS.map((g) => {
      const names = g.items.filter((i) => i.id !== "overview").map((i) => i.name).join(", ");
      return names ? `${g.group}: ${names}` : null;
    }).filter(Boolean);
    const dashboardNames = DASHBOARDS.flatMap((g) => g.items).map((d) => d.name);
    const body = [
      `${kits.length} kits, ${entries.length + 1} components plus ${dashboardNames.length} dashboard templates:`,
      kits.join("\n"),
      dashboardNames.length ? `Dashboards: ${dashboardNames.join(", ")}.` : null,
      "The free core is MIT; kits are commercial — one license covers everything.",
    ].filter(Boolean).join("\n\n");
    return { body, code: "npx vault-ui init\n# browse /docs to preview and add components" };
  }

  return null;
}