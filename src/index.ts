import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { registerResources } from "./resources/register.js";
import { registerTools } from "./tools/register.js";
import { registerPrompts } from "./prompts/register.js";
import { resources } from "./resources/index.js";
import { tools } from "./tools/index.js";
import { prompts } from "./prompts/index.js";

if (process.env.https_proxy || process.env.http_proxy) {
  setGlobalDispatcher(new EnvHttpProxyAgent());
}

const server = new McpServer({
  name: "Garoon MCP Server",
  version: "0.0.1",
});

registerResources(server, resources);
registerTools(server, tools);
registerPrompts(server, prompts);

const transport = new StdioServerTransport();
await server.connect(transport);
