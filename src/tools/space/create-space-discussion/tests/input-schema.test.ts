import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-create-space-discussion inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require spaceId and title", () => {
    expect(() => schema.parse({})).toThrow();
    expect(() => schema.parse({ spaceId: "1" })).toThrow();
  });

  it("should accept spaceId and title only", () => {
    const result = schema.parse({ spaceId: "1", title: "Test" });
    expect(result).toEqual({
      spaceId: "1",
      title: "Test",
      isHtmlBody: false,
    });
  });

  it("should accept all fields", () => {
    const result = schema.parse({
      spaceId: "1",
      title: "Test",
      body: "Discussion body",
      isHtmlBody: true,
    });
    expect(result).toEqual({
      spaceId: "1",
      title: "Test",
      body: "Discussion body",
      isHtmlBody: true,
    });
  });
});
