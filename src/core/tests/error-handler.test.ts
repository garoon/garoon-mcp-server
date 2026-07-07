import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  createErrorOutput,
  MAX_RESPONSE_TEXT_LENGTH,
} from "../error-handler.js";
import { HttpErrorResponse } from "../../client.js";

describe("createErrorOutput", () => {
  it("includes status and responseText for an HttpErrorResponse", () => {
    const result = createErrorOutput(new HttpErrorResponse(404, "Not Found"));

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual({
      error: "HTTP Error 404",
      status: 404,
      responseText: "Not Found",
    });
  });

  it("does not embed the response body in the error field", () => {
    const body = "x".repeat(5000);
    const result = createErrorOutput(new HttpErrorResponse(500, body));
    const output = result.structuredContent as {
      error: string;
      responseText: string;
    };

    expect(output.error).toBe("HTTP Error 500");
    expect(output.error).not.toContain("x");
  });

  it("truncates a long responseText and marks it as truncated", () => {
    const longText = "a".repeat(MAX_RESPONSE_TEXT_LENGTH + 500);
    const result = createErrorOutput(new HttpErrorResponse(500, longText));
    const output = result.structuredContent as {
      responseText: string;
    };

    expect(output.responseText).toBe(
      `${"a".repeat(MAX_RESPONSE_TEXT_LENGTH)}... (truncated)`,
    );
  });

  it("keeps a responseText of exactly the limit untrimmed", () => {
    const text = "a".repeat(MAX_RESPONSE_TEXT_LENGTH);
    const result = createErrorOutput(new HttpErrorResponse(500, text));
    const output = result.structuredContent as {
      responseText: string;
    };

    expect(output.responseText).toBe(text);
  });

  it("trims a responseText that exceeds the limit by one character", () => {
    const text = "a".repeat(MAX_RESPONSE_TEXT_LENGTH + 1);
    const result = createErrorOutput(new HttpErrorResponse(500, text));
    const output = result.structuredContent as {
      responseText: string;
    };

    expect(output.responseText).toBe(
      `${"a".repeat(MAX_RESPONSE_TEXT_LENGTH)}... (truncated)`,
    );
  });

  it("keeps the current shape for a ZodError", () => {
    const schema = z.object({ value: z.string() });
    const parsed = schema.safeParse({ value: 123 });
    if (parsed.success) {
      throw new Error("expected the schema to fail");
    }

    const result = createErrorOutput(parsed.error);

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual({
      error: expect.stringContaining("Validation error:"),
    });
  });

  it("keeps the current shape for a generic Error", () => {
    const result = createErrorOutput(new Error("boom"));

    expect(result.structuredContent).toEqual({ error: "boom" });
  });

  it("keeps the current shape for a non-Error value", () => {
    const result = createErrorOutput("unexpected");

    expect(result.structuredContent).toEqual({
      error: "Unknown error occurred",
    });
  });
});
