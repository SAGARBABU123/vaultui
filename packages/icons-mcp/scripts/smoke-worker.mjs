/**
 * Smoke-tests the built Worker without wrangler/workerd.
 * Serves ASSETS from apps/icons/dist and drives JSON-RPC over the default handler.
 * Run after `pnpm --filter @vaultui/icons-site build`.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../dist/worker.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, "..", "..", "..", "apps", "icons", "dist");

const env = {
  ASSETS: {
    async fetch(input) {
      const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url);
      const file = path.join(dist, decodeURIComponent(url.pathname));
      try {
        const body = await readFile(file);
        return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
      } catch {
        return new Response("not found", { status: 404 });
      }
    },
  },
};

let nextId = 1;

async function rpc(method, params = {}) {
  const response = await worker.fetch(
    new Request("https://icons.example.test/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }),
    }),
    env,
  );
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 200) };
  }
  return { status: response.status, body };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`ok - ${message}`);
  }
}

const init = await rpc("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "smoke", version: "1.0.0" },
});
assert(init.status === 200, "initialize returns 200");
assert(init.body?.result?.serverInfo?.name === "vaultui-icons", "serverInfo name");

const tools = await rpc("tools/list");
const toolNames = tools.body?.result?.tools?.map((tool) => tool.name) ?? [];
assert(tools.status === 200, "tools/list returns 200");
assert(
  ["search_icons", "get_icon", "list_categories", "list_icons", "get_usage"].every((name) =>
    toolNames.includes(name),
  ),
  `five tools registered (${toolNames.join(", ")})`,
);

const search = await rpc("tools/call", {
  name: "search_icons",
  arguments: { query: "home", limit: 5 },
});
assert(search.status === 200 && !search.body?.result?.isError, "search_icons succeeds");
assert(
  (search.body?.result?.structuredContent?.icons ?? []).some((icon) => icon.name === "house"),
  "search_icons finds house",
);

const icon = await rpc("tools/call", {
  name: "get_icon",
  arguments: { name: "house", weight: "bold", format: "react" },
});
assert(icon.status === 200 && !icon.body?.result?.isError, "get_icon succeeds");
const structured = icon.body?.result?.structuredContent ?? {};
assert(String(structured.svg ?? "").includes("<svg"), "get_icon returns SVG");
assert(String(structured.importLine ?? "").includes("HouseBold"), "get_icon returns React import");

const categories = await rpc("tools/call", { name: "list_categories", arguments: {} });
assert(categories.status === 200 && !categories.body?.result?.isError, "list_categories succeeds");

const missing = await rpc("tools/call", {
  name: "get_icon",
  arguments: { name: "definitely-not-an-icon", weight: "regular", format: "svg" },
});
assert(missing.body?.result?.isError === true, "unknown icon returns a tool error");

console.log(process.exitCode ? "SMOKE FAILED" : "SMOKE PASS");
