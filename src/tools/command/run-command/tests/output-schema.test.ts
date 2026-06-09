import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-run-command outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate a successful response", () => {
    const validOutput = {
      result: {
        statusCode: 200,
        responseBody: '{"url":"/g/schedule/index"}',
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate an error response", () => {
    const validOutput = {
      error: "Login failed",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty object", () => {
    expect(() => schema.parse({})).not.toThrow();
  });
});
