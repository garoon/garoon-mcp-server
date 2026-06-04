import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-create-discussion-comment outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        id: "1",
        spaceId: "5",
        discussionId: "10",
        body: "A comment",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate response with all fields", () => {
    const validOutput = {
      result: {
        id: "1",
        spaceId: "5",
        discussionId: "10",
        body: "<p>HTML comment</p>",
        isHtmlBody: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
