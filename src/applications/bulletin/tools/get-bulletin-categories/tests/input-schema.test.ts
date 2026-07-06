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
});
