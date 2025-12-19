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
});
