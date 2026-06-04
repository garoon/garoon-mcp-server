import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-presence-by-id inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require userId", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept userId", () => {
    expect(schema.parse({ userId: "1" })).toEqual({
      userId: "1",
    });
  });
});
