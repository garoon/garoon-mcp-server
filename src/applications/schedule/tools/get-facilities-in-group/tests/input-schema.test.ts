import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-facilities-in-group inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require facilityGroupId", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept facilityGroupId only", () => {
    expect(schema.parse({ facilityGroupId: "1" })).toEqual({
      facilityGroupId: "1",
    });
  });

  it("should accept facilityGroupId with limit and offset", () => {
    expect(
      schema.parse({ facilityGroupId: "1", limit: 5, offset: 10 }),
    ).toEqual({
      facilityGroupId: "1",
      limit: 5,
      offset: 10,
    });
  });

  it("should reject non-numeric facilityGroupId", () => {
    const invalidIds = ["", "abc", "12a", "-1"];

    invalidIds.forEach((facilityGroupId) => {
      const result = schema.safeParse({ facilityGroupId });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("facilityGroupId");
      }
    });
  });

  it("should reject out-of-range limit and offset", () => {
    const limitResult = schema.safeParse({ facilityGroupId: "1", limit: 1001 });
    expect(limitResult.success).toBe(false);
    if (!limitResult.success) {
      expect(limitResult.error.issues[0].path).toContain("limit");
    }

    const offsetResult = schema.safeParse({ facilityGroupId: "1", offset: -1 });
    expect(offsetResult.success).toBe(false);
    if (!offsetResult.success) {
      expect(offsetResult.error.issues[0].path).toContain("offset");
    }
  });
});
