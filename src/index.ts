import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Agent, EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { readFileSync } from "fs";
import { registerTools } from "./tools/register.js";
import { tools } from "./tools/index.js";
import { VERSION } from "./build-constants.js";

const PFX_PATH = process.env.GAROON_PFX_FILE_PATH;
const PFX_PASSPHRASE = process.env.GAROON_PFX_FILE_PASSWORD;

const tlsOptions: { pfx?: Buffer; passphrase?: string } = {};
if (PFX_PATH && PFX_PASSPHRASE) {
  tlsOptions.pfx = readFileSync(PFX_PATH);
  tlsOptions.passphrase = PFX_PASSPHRASE;
}
if (process.env.https_proxy || process.env.http_proxy) {
  setGlobalDispatcher(
    new EnvHttpProxyAgent({
      requestTls: tlsOptions,
    }),
  );
} else if (PFX_PATH && PFX_PASSPHRASE) {
  setGlobalDispatcher(
    new Agent({
      connect: tlsOptions,
    }),
  );
}

const server = new McpServer({
  name: "Garoon MCP Server",
  version: VERSION,
});

registerTools(server, tools);

const transport = new StdioServerTransport();
await server.connect(transport);
