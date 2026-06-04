import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-space-discussions inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require spaceId", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept spaceId only", () => {
    expect(schema.parse({ spaceId: "1" })).toEqual({
      spaceId: "1",
    });
  });

  it("should accept spaceId with limit and offset", () => {
    expect(schema.parse({ spaceId: "1", limit: 50, offset: 10 })).toEqual({
      spaceId: "1",
      limit: 50,
      offset: 10,
    });
  });
});
