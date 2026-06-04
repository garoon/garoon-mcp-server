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
});
