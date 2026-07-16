import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-schedule-event-comments inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require eventId", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept eventId only", () => {
    expect(schema.parse({ eventId: "2" })).toEqual({ eventId: "2" });
  });

  it("should accept eventId with limit and offset", () => {
    expect(schema.parse({ eventId: "2", limit: 5, offset: 10 })).toEqual({
      eventId: "2",
      limit: 5,
      offset: 10,
    });
  });

  it("should reject non-numeric eventId", () => {
    const invalidIds = ["", "abc", "12a", "-1"];

    invalidIds.forEach((eventId) => {
      const result = schema.safeParse({ eventId });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("eventId");
    });
  });

  it("should reject out-of-range limit and offset", () => {
    const limitResult = schema.safeParse({ eventId: "2", limit: 1001 });
    expect(limitResult.success).toBe(false);
    expect(limitResult.error?.issues[0].path).toContain("limit");

    const offsetResult = schema.safeParse({ eventId: "2", offset: -1 });
    expect(offsetResult.success).toBe(false);
    expect(offsetResult.error?.issues[0].path).toContain("offset");
  });
});
