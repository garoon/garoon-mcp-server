import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-facility-groups inputSchema", () => {
  it("should accept empty input", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({})).toEqual({});
  });

  it("should accept limit and offset", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ limit: 30, offset: 10 })).toEqual({
      limit: 30,
      offset: 10,
    });
  });

  it("should reject out-of-range limit and offset", () => {
    const schema = z.object(inputSchema);

    const limitResult = schema.safeParse({ limit: 1001 });
    expect(limitResult.success).toBe(false);
    if (!limitResult.success) {
      expect(limitResult.error.issues[0].path).toContain("limit");
    }

    const offsetResult = schema.safeParse({ offset: -1 });
    expect(offsetResult.success).toBe(false);
    if (!offsetResult.success) {
      expect(offsetResult.error.issues[0].path).toContain("offset");
    }
  });
});
