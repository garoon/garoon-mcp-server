import { describe, it, expect } from "vitest";
import { getBulletinTopicsTool } from "../index.js";

describe("get-bulletin-topics tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getBulletinTopicsTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
