import { describe, it, expect } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { z } from "zod";
import { defineTool, registerTools } from "../register.js";
import { createStructuredOutputSchema } from "../structured-output.js";
import { HttpErrorResponse } from "../../client.js";

async function connectClient(server: McpServer) {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);
  return client;
}

function buildServer() {
  const server = new McpServer({ name: "test-server", version: "0.0.0" });
  registerTools(server, [
    defineTool({
      name: "failing-tool",
      title: "Failing Tool",
      description: "A tool whose handler always throws",
      inputSchema: {},
      outputSchema: createStructuredOutputSchema({ value: z.string() }),
      handler: () => {
        throw new Error("boom");
      },
    }),
    defineTool({
      name: "ok-tool",
      title: "OK Tool",
      description: "A tool whose handler succeeds",
      inputSchema: {},
      outputSchema: createStructuredOutputSchema({ value: z.string() }),
      handler: () => ({ value: "hello" }),
    }),
    defineTool({
      name: "http-failing-tool",
      title: "HTTP Failing Tool",
      description: "A tool whose handler throws an HttpErrorResponse",
      inputSchema: {},
      outputSchema: createStructuredOutputSchema({ value: z.string() }),
      handler: () => {
        throw new HttpErrorResponse(404, "Not Found");
      },
    }),
  ]);
  return server;
}

describe("defineTool over a live MCP SDK transport", () => {
  it("returns an error response without tripping the client output validator", async () => {
    const client = await connectClient(buildServer());
    // listTools() compiles the client-side output validators, exercising the
    // strict-client path where a required `result` would reject error responses.
    await client.listTools();

    const result = await client.callTool({
      name: "failing-tool",
      arguments: {},
    });

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual({ error: "boom" });
  });

  it("includes status and responseText for an HTTP error without tripping the client validator", async () => {
    const client = await connectClient(buildServer());
    await client.listTools();

    const result = await client.callTool({
      name: "http-failing-tool",
      arguments: {},
    });

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual({
      error: "HTTP Error 404",
      status: 404,
      responseText: "Not Found",
    });
  });

  it("returns a success response with a structured result", async () => {
    const client = await connectClient(buildServer());
    await client.listTools();

    const result = await client.callTool({ name: "ok-tool", arguments: {} });

    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toEqual({ result: { value: "hello" } });
  });

  it("advertises an output schema that does not require result", async () => {
    const client = await connectClient(buildServer());

    const { tools } = await client.listTools();
    const failing = tools.find((tool) => tool.name === "failing-tool");
    const required = failing?.outputSchema?.required ?? [];

    expect(required).not.toContain("result");
  });
});
