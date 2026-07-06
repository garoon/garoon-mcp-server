import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-bulletin-topics inputSchema", () => {
  it("should require categoryId", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept categoryId only", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ categoryId: "1" })).toEqual({ categoryId: "1" });
  });

  it("should accept all parameters", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ categoryId: "1", limit: 50, offset: 10 })).toEqual({
      categoryId: "1",
      limit: 50,
      offset: 10,
    });
  });

  it("should accept numeric-string categoryId", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ categoryId: "12345" })).toEqual({
      categoryId: "12345",
    });
  });

  it("should reject non-numeric categoryId", () => {
    const schema = z.object(inputSchema);
    const invalidInputs = ["", "abc", "12a", "-1"];

    invalidInputs.forEach((categoryId) => {
      const result = schema.safeParse({ categoryId });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("categoryId");
      }
    });
  });

  it("should accept limit boundary values", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({ categoryId: "1", limit: 1 })).not.toThrow();
    expect(() => schema.parse({ categoryId: "1", limit: 1000 })).not.toThrow();
  });

  it("should reject out-of-range limit values", () => {
    const schema = z.object(inputSchema);
    const invalidInputs = [
      { categoryId: "1", limit: 0 },
      { categoryId: "1", limit: 1001 },
      { categoryId: "1", limit: 1.5 },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("limit");
      }
    });
  });

  it("should accept offset boundary value", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({ categoryId: "1", offset: 0 })).not.toThrow();
  });

  it("should reject out-of-range offset values", () => {
    const schema = z.object(inputSchema);
    const invalidInputs = [
      { categoryId: "1", offset: -1 },
      { categoryId: "1", offset: 0.5 },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("offset");
      }
    });
  });
});
