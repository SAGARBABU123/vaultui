import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Core } from "./core.js";
import { registerTools } from "./tools.js";

export const SERVER_NAME = "vaultui-icons";
export const SERVER_VERSION = "0.1.0";

export const INSTRUCTIONS = [
  "Abhayaui Icons MCP — 2,474 original icons in six weights (thin, light, regular, bold, fill, duotone).",
  "Workflow: call search_icons with the concept, pick a canonical name from the results, then call get_icon",
  "with the desired weight and format (react, vue, svelte, html or svg). Never invent icon names or import paths.",
  "Use list_categories when you need the taxonomy; use get_usage for install instructions.",
].join(" ");

export function createServer(core: Core, version = SERVER_VERSION): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version },
    { instructions: INSTRUCTIONS },
  );
  registerTools(server, core);
  return server;
}
