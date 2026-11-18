import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Core } from "./core.js";

type ToolResult = {
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};

function ok(text: string, structuredContent?: Record<string, unknown>): ToolResult {
  return structuredContent ? { content: [{ type: "text", text }], structuredContent } : { content: [{ type: "text", text }] };
}

function fail(error: unknown): ToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

const WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"];

export function registerTools(server: McpServer, core: Core): void {
  server.registerTool(
    "search_icons",
    {
      title: "Search icons",
      description:
        "Search the Abhayaui icon library (2,474 original icons, 6 weights) by concept, name, tag or alias. " +
        "Call this BEFORE writing any icon import so you use canonical names instead of guessing. " +
        "Returns ranked canonical names; pass one to get_icon for SVG and framework imports.",
      inputSchema: {
        query: z.string().min(1).describe("Concept or keywords, e.g. 'home', 'shopping cart', 'warning'."),
        category: z
          .string()
          .optional()
          .describe("Optional category id from list_categories, e.g. 'core-ui'."),
        limit: z.number().int().min(1).max(50).optional().describe("Results per page (default 20)."),
        cursor: z.string().optional().describe("nextCursor from a previous search page."),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args: { query: string; category?: string; limit?: number; cursor?: string }) => {
      try {
        const page = core.search(args);
        const lines = [
          `Found ${page.total} icon${page.total === 1 ? "" : "s"} for "${args.query}" (showing ${page.items.length}).`,
          "",
          ...page.items.map(
            (hit) =>
              `- ${hit.name} — ${hit.categoryLabel}${hit.tags.length ? ` · tags: ${hit.tags.slice(0, 6).join(", ")}` : ""}`,
          ),
          "",
          "Call get_icon with one of these names to fetch the SVG or a framework import.",
          page.nextCursor ? `Next page: search_icons with cursor "${page.nextCursor}".` : "",
        ].filter(Boolean);
        return ok(lines.join("\n"), {
          query: args.query,
          total: page.total,
          nextCursor: page.nextCursor,
          icons: page.items,
        });
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_icon",
    {
      title: "Get icon",
      description:
        "Fetch one icon by canonical name: raw SVG plus a ready import/usage snippet for React, Vue, Svelte or HTML. " +
        "Use names returned by search_icons or list_icons. Defaults to the regular weight.",
      inputSchema: {
        name: z.string().min(1).describe("Canonical icon name from search_icons, e.g. 'house'."),
        weight: z
          .enum(["thin", "light", "regular", "bold", "fill", "duotone"])
          .optional()
          .describe("Stroke weight (default 'regular')."),
        format: z
          .enum(["svg", "react", "vue", "svelte", "html"])
          .optional()
          .describe("Output format (default 'svg')."),
        size: z.number().int().min(8).max(256).optional().describe("Optional square size in pixels."),
        color: z
          .string()
          .optional()
          .describe('Optional colour: "currentColor" or a hex value like "#4f46e5".'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args: {
      name: string;
      weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
      format?: "svg" | "react" | "vue" | "svelte" | "html";
      size?: number;
      color?: string;
    }) => {
      try {
        const icon = await core.render({
          name: args.name,
          weight: args.weight ?? "regular",
          format: args.format ?? "svg",
          size: args.size,
          color: args.color,
        });
        const parts = [
          `# ${icon.name} (${icon.weight})`,
          `${icon.categoryLabel} · ${icon.pageUrl}`,
          "",
        ];
        if (icon.importLine) {
          parts.push("Import:", "```ts", icon.importLine, "```", "", "Usage:", "```html", icon.usage, "```", "");
        }
        parts.push("SVG:", "```svg", icon.svg, "```", "", `License: ${icon.license}`);
        return ok(parts.join("\n"), { ...icon });
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "list_categories",
    {
      title: "List categories",
      description:
        "List the ten Abhayaui icon categories with ids, labels, descriptions and icon counts. " +
        "Use the id as the category filter for search_icons or list_icons.",
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => {
      const categories = core.categories();
      const text = [
        `${categories.length} categories (${core.index.total} icons total):`,
        "",
        ...categories.map(
          (category) => `- ${category.id} — ${category.label} (${category.count}): ${category.blurb}`,
        ),
      ].join("\n");
      return ok(text, { total: core.index.total, categories });
    },
  );

  server.registerTool(
    "list_icons",
    {
      title: "List icons",
      description:
        "Page through the full icon inventory, optionally filtered by category. " +
        "Prefer search_icons when you have a concept in mind.",
      inputSchema: {
        category: z.string().optional().describe("Category id from list_categories."),
        limit: z.number().int().min(1).max(100).optional().describe("Page size (default 50)."),
        offset: z.number().int().min(0).optional().describe("Zero-based offset (default 0)."),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args: { category?: string; limit?: number; offset?: number }) => {
      try {
        const page = core.list(args);
        const text = [
          `${page.total} icons${args.category ? ` in ${args.category}` : ""} (showing ${page.items.length}).`,
          "",
          ...page.items.map((icon) => `- ${icon.name} — ${icon.categoryLabel}`),
          page.nextCursor ? `\nNext page: list_icons with offset ${page.nextCursor}.` : "",
        ].join("\n");
        return ok(text, {
          total: page.total,
          nextCursor: page.nextCursor,
          icons: page.items,
        });
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_usage",
    {
      title: "Get usage",
      description:
        "Install and usage instructions for the Abhayaui icon packages (React, Vue, Svelte, raw SVG), " +
        "including the MCP endpoint and weights.",
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => {
      const text = [
        "# Abhayaui Icons",
        `Inventory: ${core.index.total} icons × ${core.index.weights.length} weights (${core.index.weights.join(", ")}).`,
        "",
        "## Packages",
        "```bash",
        "npm install @vaultui/icons-react",
        "npm install @vaultui/icons-vue",
        "npm install @vaultui/icons-svelte",
        "```",
        "",
        "## Import",
        '```tsx',
        'import { House } from "@vaultui/icons-react";',
        'import { HouseBold } from "@vaultui/icons-react";',
        "```",
        "",
        "## MCP",
        `Remote endpoint: ${core.siteUrl}/mcp`,
        "Local: npx -y @vaultui/icons-mcp",
        "",
        "Tools: search_icons, get_icon, list_categories, list_icons, get_usage.",
        "",
        "License: MIT (Vault UI); geometry generated from Phosphor Icons (MIT). See THIRD-PARTY.md.",
      ].join("\n");
      return ok(text, {
        total: core.index.total,
        weights: core.index.weights,
        endpoint: `${core.siteUrl}/mcp`,
        packages: ["@vaultui/icons-react", "@vaultui/icons-vue", "@vaultui/icons-svelte"],
        license: "MIT",
      });
    },
  );

  void WEIGHTS;
}
