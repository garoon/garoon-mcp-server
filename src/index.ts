#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { Agent, EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { readFileSync } from "fs";
import { loadConfig, setConfig, type Config } from "./config.js";
import { createServer } from "./server.js";

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

serveStdio(createServer, {
  // stderr for the same reason as the configuration error above.
  onerror: (error) => {
    process.stderr.write(`${error.message}\n`);
  },
});
