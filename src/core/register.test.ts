import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";
import { defineTool } from "./register.js";
import { createStructuredOutputSchema } from "./structured-output.js";

const mockExtra = {} as never;
const emptyOutputSchema = createStructuredOutputSchema({});

describe("defineTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should wrap the handler result into a validated structured output", async () => {
    const outputSchema = createStructuredOutputSchema({
      value: z.string(),
    });

    const tool = defineTool({
      name: "success-tool",
      title: "Success Tool",
      description: "A tool that succeeds",
      inputSchema: {},
      outputSchema,
      handler: async () => ({ value: "test data" }),
    });

    const result = await tool.callback({}, mockExtra);

    const expectedStructured = { result: { value: "test data" } };
    expect(result).toEqual({
      structuredContent: expectedStructured,
      content: [
        {
          type: "text",
          text: JSON.stringify(expectedStructured, null, 2),
        },
      ],
    });
  });

  it("should catch synchronous errors thrown in the handler", async () => {
    const tool = defineTool({
      name: "sync-error-tool",
      title: "Sync Error Tool",
      description: "A tool for testing error handling",
      inputSchema: {},
      outputSchema: emptyOutputSchema,
      handler: () => {
        throw new Error("Test error");
      },
    });

    const result = await tool.callback({}, mockExtra);

    expect(result).toEqual({
      isError: true,
      structuredContent: {
        error: "Test error",
      },
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: "Test error" }, null, 2),
        },
      ],
    });
  });

  it("should catch asynchronous errors thrown in the handler", async () => {
    const tool = defineTool({
      name: "async-error-tool",
      title: "Async Error Tool",
      description: "A tool for testing async error handling",
      inputSchema: {},
      outputSchema: emptyOutputSchema,
      handler: async () => {
        throw new Error("Async test error");
      },
    });

    const result = await tool.callback({}, mockExtra);

    expect(result).toEqual({
      isError: true,
      structuredContent: {
        error: "Async test error",
      },
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: "Async test error" }, null, 2),
        },
      ],
    });
  });

  it("should handle non-Error objects thrown in the handler", async () => {
    const tool = defineTool({
      name: "string-error-tool",
      title: "String Error Tool",
      description: "A tool that throws string",
      inputSchema: {},
      outputSchema: emptyOutputSchema,
      handler: () => {
        // eslint-disable-next-line no-throw-literal
        throw "String error";
      },
    });

    const result = await tool.callback({}, mockExtra);

    expect(result).toEqual({
      isError: true,
      structuredContent: {
        error: "Unknown error occurred",
      },
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: "Unknown error occurred" }, null, 2),
        },
      ],
    });
  });

  it("should return a validation error when the handler result violates the schema", async () => {
    const outputSchema = createStructuredOutputSchema({
      value: z.string(),
    });

    const tool = defineTool({
      name: "invalid-output-tool",
      title: "Invalid Output Tool",
      description: "A tool that returns an invalid result",
      inputSchema: {},
      outputSchema,
      // @ts-expect-error the value type mismatch is caught statically; this test
      // verifies the runtime validation path in defineTool as a safety net.
      handler: async () => ({ value: 123 }),
    });

    const result = await tool.callback({}, mockExtra);

    expect(result.isError).toBe(true);
    expect((result.structuredContent as { error: string }).error).toContain(
      "Validation error",
    );
  });

  it("should pass the parsed input and extra to the handler", async () => {
    const handler = vi.fn().mockResolvedValue({});

    const tool = defineTool({
      name: "args-tool",
      title: "Args Tool",
      description: "A tool that receives arguments",
      inputSchema: {},
      outputSchema: emptyOutputSchema,
      handler,
    });

    const testArgs = { param1: "value1" };
    await tool.callback(testArgs, mockExtra);

    expect(handler).toHaveBeenCalledWith(testArgs, mockExtra);
  });

  it("should build config from the definition fields", () => {
    const inputSchema = {};
    const outputSchema = emptyOutputSchema;

    const tool = defineTool({
      name: "config-tool",
      title: "Config Tool",
      description: "A tool for verifying config",
      inputSchema,
      outputSchema,
      handler: async () => ({}),
    });

    expect(tool.name).toBe("config-tool");
    expect(tool.config.title).toBe("Config Tool");
    expect(tool.config.description).toBe("A tool for verifying config");
    expect(tool.config.inputSchema).toBe(inputSchema);
    expect(tool.config.annotations).toBeUndefined();
    expect(typeof tool.callback).toBe("function");

    // The advertised outputSchema relaxes result to optional while keeping error.
    expect(tool.config.outputSchema.error).toBe(outputSchema.error);
    expect(tool.config.outputSchema.result).not.toBe(outputSchema.result);
    expect(z.object(tool.config.outputSchema).safeParse({}).success).toBe(true);
    expect(z.object(outputSchema).safeParse({}).success).toBe(false);
  });

  it("should reject an empty object because result is required", () => {
    const outputSchema = createStructuredOutputSchema({
      value: z.string(),
    });

    const parsed = z.object(outputSchema).safeParse({});

    expect(parsed.success).toBe(false);
  });
});
