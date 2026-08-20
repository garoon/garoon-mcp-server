// The MCP specification requires tool schemas to conform to JSON Schema 2020-12
// (SEP-2106), but the SDK converts them without specifying a target, so its own
// tools/list handler advertises draft-07. Clients that honor the declared
// dialect reject every tool of this server as a result.
// Replacing that handler is the only fix available to a server author: the SDK
// exposes no option for the conversion target, and registerTool accepts Zod
// schemas only, so a pre-converted JSON Schema cannot be handed to it either.
// This module is a stopgap, so delete it rather than port it once the SDK emits
// 2020-12 itself. The v2 packages (@modelcontextprotocol/server) already do,
// and their own handler covers what this one deliberately leaves out, so
// carrying a replacement handler into v2 would only drift from the SDK output.
// ref: https://github.com/modelcontextprotocol/typescript-sdk/issues/2084
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z, type ZodRawShape } from "zod";
import type { ToolDefinition } from "./register.js";

function toAdvertisedSchema(shape: ZodRawShape, io: "input" | "output") {
  // `io` mirrors the pipeStrategy the SDK passes for each schema, so the
  // advertised schema stays identical to the SDK output apart from the dialect.
  return z.toJSONSchema(z.object(shape), {
    target: "draft-2020-12",
    io,
  }) as Tool["inputSchema"];
}

// registerTool records every tool it registers as forbidding the tasks
// extension, and the SDK advertises that, so the replacement handler has to
// repeat it to leave the response unchanged apart from the dialect.
const EXECUTION: Tool["execution"] = { taskSupport: "forbidden" };

export function registerToolListHandler(
  server: McpServer,
  tools: readonly ToolDefinition[],
) {
  // Call this once, after every registerTool call: McpServer installs its own
  // tools/list handler on the first registration and rejects a handler that is
  // already present, whereas setRequestHandler replaces an existing one.
  // The response is built from `tools` alone, not from what the server holds,
  // so a second call advertises only its own argument, and a tool the SDK
  // disables or updates afterwards keeps being advertised as first passed.
  // That is enough for a single registration of a fixed tool set, which is all
  // src/index.ts does.
  server.server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: tools.map(
      ({ name, config }): Tool => ({
        name,
        title: config.title,
        description: config.description,
        annotations: config.annotations,
        execution: EXECUTION,
        inputSchema: toAdvertisedSchema(config.inputSchema, "input"),
        outputSchema: toAdvertisedSchema(config.outputSchema, "output"),
      }),
    ),
  }));
}
