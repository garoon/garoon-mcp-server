import { describe, it, expect } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { defineTool, registerTools, type ToolDefinition } from "../register.js";
import { createStructuredOutputSchema } from "../structured-output.js";

const JSON_SCHEMA_2020_12 = "https://json-schema.org/draft/2020-12/schema";

const testTools: readonly ToolDefinition[] = [
  defineTool({
    name: "no-argument-tool",
    title: "No Argument Tool",
    description: "A tool that takes no arguments",
    inputSchema: {},
    outputSchema: createStructuredOutputSchema({ value: z.string() }),
    annotations: { readOnlyHint: true, openWorldHint: false },
    handler: () => ({ value: "hello" }),
  }),
  defineTool({
    name: "nested-argument-tool",
    title: "Nested Argument Tool",
    description: "A tool that takes nested and optional arguments",
    inputSchema: {
      id: z.string().describe("Identifier of the record"),
      limit: z.number().int().optional(),
      range: z.object({ start: z.string(), end: z.string().optional() }),
      tags: z.array(z.string()).optional(),
    },
    outputSchema: createStructuredOutputSchema({
      values: z.array(z.object({ id: z.string() })),
    }),
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    handler: () => ({ values: [{ id: "1" }] }),
  }),
];

async function listTools(register: (server: McpServer) => void) {
  const server = new McpServer({ name: "test-server", version: "0.0.0" });
  register(server);

  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);

  const { tools } = await client.listTools();
  return tools;
}

function omitDialect(schema: Record<string, unknown>) {
  const { $schema, ...rest } = schema;
  return rest;
}

function omitDialects(tools: Tool[]) {
  return tools.map((tool) => ({
    ...tool,
    inputSchema: omitDialect(tool.inputSchema),
    outputSchema: tool.outputSchema
      ? omitDialect(tool.outputSchema)
      : undefined,
  }));
}

describe("advertised tool schemas", () => {
  it("declares JSON Schema 2020-12 for every input and output schema", async () => {
    const tools = await listTools((server) => registerTools(server, testTools));

    expect(tools).toHaveLength(testTools.length);
    tools.forEach((tool) => {
      expect(tool.inputSchema.$schema).toBe(JSON_SCHEMA_2020_12);
      expect(tool.outputSchema?.$schema).toBe(JSON_SCHEMA_2020_12);
    });
  });

  it("keeps the advertised definitions identical to the SDK output apart from the dialect", async () => {
    const [advertised, sdkDefault] = await Promise.all([
      listTools((server) => registerTools(server, testTools)),
      listTools((server) => {
        testTools.forEach((tool) => {
          server.registerTool(tool.name, tool.config, tool.callback);
        });
      }),
    ]);

    expect(omitDialects(advertised)).toEqual(omitDialects(sdkDefault));
  });

  // This pins the SDK behavior the replacement handler exists for. Once the SDK
  // emits 2020-12 itself, this test fails and src/core/tool-list.ts can go.
  it("is needed because the SDK still advertises draft-07 on its own", async () => {
    const tools = await listTools((server) => {
      testTools.forEach((tool) => {
        server.registerTool(tool.name, tool.config, tool.callback);
      });
    });

    const nested = tools.find((tool) => tool.name === "nested-argument-tool");

    expect(nested?.inputSchema.$schema).toBe(
      "http://json-schema.org/draft-07/schema#",
    );
  });

  it("still advertises an output schema that does not require result", async () => {
    const tools = await listTools((server) => registerTools(server, testTools));

    tools.forEach((tool) => {
      expect(tool.outputSchema?.required ?? []).not.toContain("result");
    });
  });
});
