import { describe, it, expect } from "vitest";
import { getBulletinCategoriesTool } from "../index.js";

describe("get-bulletin-categories tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getBulletinCategoriesTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
