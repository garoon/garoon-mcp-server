import { describe, it, expect } from "vitest";
import { getGaroonUsersTool } from "../index.js";

describe("get-garoon-users tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getGaroonUsersTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
