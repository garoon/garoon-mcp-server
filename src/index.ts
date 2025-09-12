import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { readFileSync } from "fs";
import { registerResources } from "./resources/register.js";
import { registerTools } from "./tools/register.js";
import { registerPrompts } from "./prompts/register.js";
import { resources } from "./resources/index.js";
import { tools } from "./tools/index.js";
import { prompts } from "./prompts/index.js";

const PFX_PATH = process.env.GAROON_PFX_FILE_PATH;
const PFX_FILE_PASSWORD = process.env.GAROON_PFX_FILE_PASSWORD;

if (process.env.https_proxy || process.env.http_proxy) {
  const requestTls: { pfx?: Buffer; passphrase?: string } = {};
  if (PFX_PATH && PFX_FILE_PASSWORD) {
    requestTls.pfx = readFileSync(PFX_PATH);
    requestTls.passphrase = readFileSync(PFX_FILE_PASSWORD, "utf8").trim();
  }
  setGlobalDispatcher(
    new EnvHttpProxyAgent({
      requestTls,
    }),
  );
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
