import { describe, it, expect } from "vitest";
import { getBulletinTopicTool } from "../index.js";

describe("get-bulletin-topic tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getBulletinTopicTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
