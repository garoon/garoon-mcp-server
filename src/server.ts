import { McpServer } from "@modelcontextprotocol/server";
import { registerTools } from "./core/register.js";
import { scheduleTools } from "./applications/schedule/index.js";
import { baseTools } from "./applications/base/index.js";
import { bulletinTools } from "./applications/bulletin/index.js";
import { VERSION } from "./build-constants.js";

/**
 * Creates a fully registered Garoon MCP server instance.
 *
 * Construction is a factory because serveStdio instantiates a server per
 * connection. When a client probes with server/discover and then falls back
 * to the legacy initialize handshake, the probe instance is discarded and a
 * second instance is constructed. The factory must therefore remain
 * inexpensive and free of side effects.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Garoon MCP Server",
    version: VERSION,
  });
  registerTools(server, [...scheduleTools, ...baseTools, ...bulletinTools]);
  return server;
}
