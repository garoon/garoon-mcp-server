import { describe, it, expect } from "vitest";
import { getFacilityGroupsTool } from "../index.js";

describe("get-facility-groups tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getFacilityGroupsTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
