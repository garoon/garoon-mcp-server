import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTool } from "./register.js";

describe("createTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should catch errors in the callback through wrapWithErrorHandling", async () => {
    const mockCallback = vi.fn().mockImplementation(() => {
      throw new Error("Test error");
    });

    const tool = createTool(
      "test-tool",
      {
        title: "Test Tool",
        description: "A tool for testing error handling",
        inputSchema: {},
        outputSchema: {},
      },
      mockCallback,
    );

    const mockExtra = {} as any;
    const result = await tool.callback({}, mockExtra);

    expect(result).toEqual({
      structuredContent: {
        isError: true,
        error: "Test error",
      },
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              isError: true,
              error: "Test error",
            },
            null,
            2,
          ),
        },
      ],
    });
    expect(mockCallback).toHaveBeenCalledWith({}, mockExtra);
  });

  it("should catch async errors in the callback", async () => {
    const mockCallback = vi.fn().mockImplementation(async () => {
      throw new Error("Async test error");
    });

    const tool = createTool(
      "async-test-tool",
      {
        title: "Async Test Tool",
        description: "A tool for testing async error handling",
        inputSchema: {},
        outputSchema: {},
      },
      mockCallback,
    );

    const mockExtra = {} as any;
    const result = await tool.callback({}, mockExtra);

    expect(result).toEqual({
      structuredContent: {
        isError: true,
        error: "Async test error",
      },
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              isError: true,
              error: "Async test error",
            },
            null,
            2,
          ),
        },
      ],
    });
  });

  it("should return successful result when callback doesn't throw", async () => {
    const expectedResult = { success: true, data: "test data" };
    const mockCallback = vi.fn().mockResolvedValue(expectedResult);

    const tool = createTool(
      "success-tool",
      {
        title: "Success Tool",
        description: "A tool that succeeds",
        inputSchema: {},
        outputSchema: {},
      },
      mockCallback,
    );

    const mockExtra = {} as any;
    const result = await tool.callback({}, mockExtra);

    expect(result).toEqual(expectedResult);
    expect(mockCallback).toHaveBeenCalledWith({}, mockExtra);
  });

  it("should create tool with correct name and config", () => {
    const mockCallback = vi.fn();
    const config = {
      title: "Test Tool",
      description: "A test tool",
      inputSchema: {},
      outputSchema: {},
    };

    const tool = createTool("test-tool", config, mockCallback);

    expect(tool.name).toBe("test-tool");
    expect(tool.config).toEqual(config);
    expect(typeof tool.callback).toBe("function");
  });

  it("should handle non-Error objects thrown in callback", async () => {
    const mockCallback = vi.fn().mockImplementation(() => {
      // eslint-disable-next-line no-throw-literal
      throw "String error";
    });

    const tool = createTool(
      "string-error-tool",
      {
        title: "String Error Tool",
        description: "A tool that throws string",
        inputSchema: {},
        outputSchema: {},
      },
      mockCallback,
    );

    const mockExtra = {} as any;
    const result = await tool.callback({}, mockExtra);

    expect(result).toEqual({
      structuredContent: {
        isError: true,
        error: "Unknown error occurred",
      },
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              isError: true,
              error: "Unknown error occurred",
            },
            null,
            2,
          ),
        },
      ],
    });
  });

  it("should pass arguments correctly to wrapped callback", async () => {
    const mockCallback = vi.fn().mockResolvedValue("success");
    const testArgs = { param1: "value1", param2: "value2" };
    const testExtra = { requestId: "123" } as any;

    const tool = createTool(
      "args-tool",
      {
        title: "Args Tool",
        description: "A tool that receives arguments",
        inputSchema: {},
        outputSchema: {},
      },
      mockCallback,
    );

    await tool.callback(testArgs, testExtra);

    expect(mockCallback).toHaveBeenCalledWith(testArgs, testExtra);
  });
});
