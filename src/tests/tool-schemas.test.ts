import { describe, it, expect, beforeAll } from "vitest";
import { Ajv2020 } from "ajv/dist/2020.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { registerTools } from "#core/register.js";
import { scheduleTools } from "#applications/schedule/index.js";
import { baseTools } from "#applications/base/index.js";
import { bulletinTools } from "#applications/bulletin/index.js";

const JSON_SCHEMA_2020_12 = "https://json-schema.org/draft/2020-12/schema";

// The same tool set src/index.ts registers, so a tool added there is covered
// here as soon as it joins its application.
const registeredTools = [...scheduleTools, ...baseTools, ...bulletinTools];

let advertisedTools: Tool[];

beforeAll(async () => {
  const server = new McpServer({ name: "test-server", version: "0.0.0" });
  registerTools(server, registeredTools);

  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);

  ({ tools: advertisedTools } = await client.listTools());
});

describe("advertised schemas of every registered tool", () => {
  it("advertises every registered tool", () => {
    expect(advertisedTools.map((tool) => tool.name).sort()).toEqual(
      registeredTools.map((tool) => tool.name).sort(),
    );
  });

  it("declares JSON Schema 2020-12", () => {
    advertisedTools.forEach((tool) => {
      expect(tool.inputSchema.$schema, `${tool.name} inputSchema`).toBe(
        JSON_SCHEMA_2020_12,
      );
      expect(tool.outputSchema?.$schema, `${tool.name} outputSchema`).toBe(
        JSON_SCHEMA_2020_12,
      );
    });
  });

  it("is valid JSON Schema 2020-12", () => {
    // Ajv validates a schema against the meta-schema of its dialect while
    // compiling it, so a construct that only draft-07 accepts fails here.
    const ajv = new Ajv2020({ strict: false, validateFormats: false });

    advertisedTools.forEach((tool) => {
      expect(
        () => ajv.compile(tool.inputSchema),
        `${tool.name} inputSchema`,
      ).not.toThrow();
      expect(
        () => ajv.compile(tool.outputSchema ?? {}),
        `${tool.name} outputSchema`,
      ).not.toThrow();
    });
  });
});
