import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createPrompt } from "./register.js";
import { z } from "zod";

describe("createPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // 各テスト実行前にモックの呼び出し履歴をクリア
  });

  afterEach(() => {
    vi.restoreAllMocks(); // 各テスト実行後にモックを元の状態に復元
  });

  it("should create a prompt with correct structure", () => {
    const config = {
      title: "Test Prompt",
      description: "A test prompt",
      argsSchema: {
        input: z.string(),
      },
    };

    const callback = vi.fn().mockResolvedValue({
      messages: [{ role: "user", content: { type: "text", text: "test" } }],
    });

    const prompt = createPrompt("test-prompt", config, callback);

    expect(prompt.name).toBe("test-prompt");
    expect(prompt.config).toEqual(config);
    expect(prompt.callback).toBeDefined();
  });

  it("should catch errors", async () => {
    const config = {
      argsSchema: {
        input: z.string(),
      },
    };

    const callback = vi.fn().mockRejectedValue(new Error("Test error"));
    const prompt = createPrompt("error-prompt", config, callback);

    const result = await prompt.callback({ input: "test" }, {} as any);

    expect(result).toEqual({
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: "[Error] Notify the user that the MCP server failed to create the prompt: Test error",
          },
        },
      ],
    });
  });

  it("should create a prompt with minimal config", () => {
    const config = {
      argsSchema: {
        input: z.string(),
      },
    };

    const callback = vi.fn();
    const prompt = createPrompt("minimal-prompt", config, callback);

    expect(prompt.name).toBe("minimal-prompt");
    expect(prompt.config.title).toBeUndefined();
    expect(prompt.config.description).toBeUndefined();
    expect(prompt.config.argsSchema).toEqual(config.argsSchema);
  });

  it("should execute callback with correct arguments", async () => {
    const config = {
      argsSchema: {
        name: z.string(),
        count: z.string().optional(),
      },
    };

    const mockResult = {
      messages: [{ role: "user", content: { type: "text", text: "result" } }],
    };
    const callback = vi.fn().mockResolvedValue(mockResult);
    const prompt = createPrompt("callback-test", config, callback);

    const args = { name: "test", count: "5" };
    const extra = { requestId: "123" } as any;

    const result = await prompt.callback(args, extra);

    expect(callback).toHaveBeenCalledWith(args, extra);
    expect(result).toEqual(mockResult);
  });

  it("should handle non-Error exceptions", async () => {
    const config = {
      argsSchema: {
        input: z.string(),
      },
    };

    const callback = vi.fn().mockImplementation(() => {
      // eslint-disable-next-line no-throw-literal
      throw "String error";
    });
    const prompt = createPrompt("string-error-prompt", config, callback);

    const result = await prompt.callback({ input: "test" }, {} as any);

    expect(result).toEqual({
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: "[Error] Notify the user that the MCP server failed to create the prompt: Unknown error occurred",
          },
        },
      ],
    });
  });

  it("should handle ZodError exceptions", async () => {
    const config = {
      argsSchema: {
        input: z.string(),
      },
    };

    const zodError = new z.ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["input"],
        message: "Expected string, received number",
      },
    ]);

    const callback = vi.fn().mockRejectedValue(zodError);
    const prompt = createPrompt("zod-error-prompt", config, callback);

    const result = await prompt.callback({ input: "test" }, {} as any);

    expect(result.messages[0].content.text).toContain("Validation error");
    expect(result.messages[0].content.text).toContain(
      "input: Expected string, received number",
    );
  });

  it("should preserve original callback function properties", () => {
    const config = {
      argsSchema: {
        input: z.string(),
      },
    };

    const originalCallback = vi.fn();
    const prompt = createPrompt("preserve-test", config, originalCallback);

    expect(prompt.callback).not.toBe(originalCallback);
    expect(typeof prompt.callback).toBe("function");
  });

  it("should handle complex argument schema", () => {
    const config = {
      title: "Complex Prompt",
      description: "A prompt with complex arguments",
      argsSchema: {
        required: z.string(),
        optional: z.string().optional(),
        withDefault: z.string().optional(),
      },
    };

    const callback = vi.fn();
    const prompt = createPrompt("complex-prompt", config, callback);

    expect(prompt.config.argsSchema.required).toBeDefined();
    expect(prompt.config.argsSchema.optional).toBeDefined();
    expect(prompt.config.argsSchema.withDefault).toBeDefined();
  });
});
