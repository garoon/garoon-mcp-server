import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-run-command inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require endpoint", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept endpoint only", () => {
    const result = schema.parse({ endpoint: "schedule/command_delete.csp" });
    expect(result.endpoint).toBe("schedule/command_delete.csp");
  });

  it("should accept endpoint with params", () => {
    const result = schema.parse({
      endpoint: "schedule/command_delete.csp",
      params: { event: "40", apply: "all" },
    });
    expect(result.endpoint).toBe("schedule/command_delete.csp");
    expect(result.params).toEqual({ event: "40", apply: "all" });
  });

  it("should reject non-string param values", () => {
    expect(() =>
      schema.parse({
        endpoint: "test.csp",
        params: { key: 123 },
      }),
    ).toThrow();
  });
});
