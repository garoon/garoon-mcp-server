import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-bulletin-categories inputSchema", () => {
  it("should accept empty input", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({})).toEqual({});
  });

  it("should accept parentId only", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ parentId: 1 })).toEqual({ parentId: 1 });
  });

  it("should accept negative parentId values", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ parentId: -1 })).toEqual({ parentId: -1 });
    expect(schema.parse({ parentId: -2 })).toEqual({ parentId: -2 });
  });

  it("should accept all parameters", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ parentId: 1, limit: 50, offset: 10 })).toEqual({
      parentId: 1,
      limit: 50,
      offset: 10,
    });
  });

  it("should accept special and positive parentId values", () => {
    const schema = z.object(inputSchema);
    [1, -1, -2, 42].forEach((parentId) => {
      expect(() => schema.parse({ parentId })).not.toThrow();
    });
  });

  it("should reject fractional parentId", () => {
    const schema = z.object(inputSchema);
    const result = schema.safeParse({ parentId: 1.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("parentId");
    }
  });
});
