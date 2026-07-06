import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-bulletin-topic inputSchema", () => {
  it("should require topicId", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept numeric-string topicId", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ topicId: "12345" })).toEqual({ topicId: "12345" });
  });

  it("should reject non-numeric topicId", () => {
    const schema = z.object(inputSchema);
    const invalidInputs = ["", "abc", "12a", "-1"];

    invalidInputs.forEach((topicId) => {
      const result = schema.safeParse({ topicId });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("topicId");
      }
    });
  });
});
