import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createCore, DEFAULT_SITE, type ShardLoader } from "./core.js";
import { MCP_INDEX } from "./generated/mcp-index.js";
import { createServer } from "./server.js";

const base = (process.env.VAULTUI_ICONS_BASE || DEFAULT_SITE).replace(/\/+$/, "");
const cache = new Map<string, Record<string, string>>();

const loader: ShardLoader = async (weight, letter) => {
  const key = `${weight}/${letter}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const response = await fetch(`${base}/data/payload/${weight}/${letter}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load icon shard ${weight}/${letter} (HTTP ${response.status}).`);
  }
  const shard = (await response.json()) as Record<string, string>;
  cache.set(key, shard);
  return shard;
};

const core = createCore(MCP_INDEX, loader, base);
const server = createServer(core);

await server.connect(new StdioServerTransport());
console.error(
  `vaultui-icons-mcp ready — ${MCP_INDEX.total} icons, ${MCP_INDEX.weights.length} weights, data ${base}`,
);
