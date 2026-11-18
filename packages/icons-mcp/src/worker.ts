import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createCore, DEFAULT_SITE, type Core, type ShardLoader } from "./core.js";
import { MCP_INDEX } from "./generated/mcp-index.js";
import { createServer } from "./server.js";

export interface Env {
  ASSETS: {
    fetch(input: Request | string | URL): Promise<Response>;
  };
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, MCP-Protocol-Version",
};

const shardCache = new Map<string, Record<string, string>>();
let coreCache: { origin: string; core: Core } | null = null;

function makeLoader(env: Env, origin: string): ShardLoader {
  return async (weight, letter) => {
    const key = `${weight}/${letter}`;
    const cached = shardCache.get(key);
    if (cached) return cached;
    const response = await env.ASSETS.fetch(
      new URL(`/data/payload/${weight}/${letter}.json`, origin),
    );
    if (!response.ok) {
      throw new Error(`Failed to load icon shard ${weight}/${letter} (HTTP ${response.status}).`);
    }
    const shard = (await response.json()) as Record<string, string>;
    shardCache.set(key, shard);
    return shard;
  };
}

function getCore(env: Env, origin: string): Core {
  if (!coreCache || coreCache.origin !== origin) {
    coreCache = { origin, core: createCore(MCP_INDEX, makeLoader(env, origin), origin || DEFAULT_SITE) };
  }
  return coreCache.core;
}

function withCors(response: Response, noStore = true): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) headers.set(key, value);
  if (noStore) headers.set("Cache-Control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(body: unknown, status = 200): Response {
  return withCors(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }),
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/mcp") return env.ASSETS.fetch(request);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }
    if (request.method !== "POST") {
      return json(
        { error: "Use POST with a JSON-RPC body. GET/DELETE are not supported on this stateless endpoint." },
        405,
      );
    }

    try {
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      const server = createServer(getCore(env, url.origin));
      await server.connect(transport);
      const response = await transport.handleRequest(request);
      return withCors(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return json({ jsonrpc: "2.0", error: { code: -32603, message }, id: null }, 500);
    }
  },
};
