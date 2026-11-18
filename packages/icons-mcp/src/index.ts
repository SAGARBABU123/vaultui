export { createCore, componentName, pascal, DEFAULT_SITE, LICENSE, WEIGHT_SUFFIX } from "./core.js";
export type {
  Core,
  IconMeta,
  IconRecord,
  IconResult,
  McpIndex,
  Page,
  SearchHit,
  SearchInput,
  ShardLoader,
  SvgShard,
} from "./core.js";
export { createServer, INSTRUCTIONS, SERVER_NAME, SERVER_VERSION } from "./server.js";
export { registerTools } from "./tools.js";
export { MCP_INDEX } from "./generated/mcp-index.js";
