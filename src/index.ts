#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Agent, EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { readFileSync } from "fs";
import { registerTools } from "./tools/register.js";
import { tools } from "./tools/index.js";
import { VERSION } from "./build-constants.js";
import { loadConfig, setConfig, type Config } from "./config.js";

let config: Config;
try {
  config = loadConfig();
} catch (error) {
  // Write to stderr because the stdio transport reserves stdout for the
  // MCP protocol; contaminating it would break the client connection.
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  // Exit immediately at the composition root so a misconfiguration fails fast
  // with a clean message rather than surfacing as an obscure error later.
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}
setConfig(config);

const tlsOptions: { pfx?: Buffer; passphrase?: string } = {};
if (config.pfx) {
  tlsOptions.pfx = readFileSync(config.pfx.filePath);
  tlsOptions.passphrase = config.pfx.filePassword;
}
if (config.proxyUrl) {
  // `config.proxyUrl` is only an enablement gate here; EnvHttpProxyAgent reads
  // https_proxy/http_proxy/no_proxy from the environment itself at request
  // time, so the URL must not be passed to the agent constructor.
  setGlobalDispatcher(
    new EnvHttpProxyAgent({
      requestTls: tlsOptions,
    }),
  );
} else if (config.pfx) {
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
