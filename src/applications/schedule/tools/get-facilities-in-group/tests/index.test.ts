import { describe, it, expect } from "vitest";
import { getFacilitiesInGroupTool } from "../index.js";

describe("get-facilities-in-group tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getFacilitiesInGroupTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
