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
import { VERSION } from "./build-constants.js";

const PFX_PATH = process.env.GAROON_PFX_FILE_PATH;
const PFX_PASSPHRASE = process.env.GAROON_PFX_FILE_PASSWORD;

if (process.env.https_proxy || process.env.http_proxy) {
  const requestTls: { pfx?: Buffer; passphrase?: string } = {};
  if (PFX_PATH && PFX_PASSPHRASE) {
    requestTls.pfx = readFileSync(PFX_PATH);
    requestTls.passphrase = PFX_PASSPHRASE;
  }
  setGlobalDispatcher(
    new EnvHttpProxyAgent({
      requestTls,
    }),
  );
}

const server = new McpServer({
  name: "Garoon MCP Server",
  version: VERSION,
});

registerResources(server, resources);
registerTools(server, tools);
registerPrompts(server, prompts);

const transport = new StdioServerTransport();
await server.connect(transport);
