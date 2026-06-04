import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-create-discussion-comment inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require spaceId, discussionId, and body", () => {
    expect(() => schema.parse({})).toThrow();
    expect(() => schema.parse({ spaceId: "1" })).toThrow();
    expect(() => schema.parse({ spaceId: "1", discussionId: "2" })).toThrow();
  });

  it("should accept required fields only", () => {
    const result = schema.parse({
      spaceId: "1",
      discussionId: "2",
      body: "A comment",
    });
    expect(result).toEqual({
      spaceId: "1",
      discussionId: "2",
      body: "A comment",
      isHtmlBody: false,
    });
  });

  it("should accept all fields", () => {
    const result = schema.parse({
      spaceId: "1",
      discussionId: "2",
      body: "<p>HTML comment</p>",
      isHtmlBody: true,
    });
    expect(result).toEqual({
      spaceId: "1",
      discussionId: "2",
      body: "<p>HTML comment</p>",
      isHtmlBody: true,
    });
  });
});
