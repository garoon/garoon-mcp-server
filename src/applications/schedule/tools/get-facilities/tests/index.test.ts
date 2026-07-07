import { describe, it, expect } from "vitest";
import { getFacilitiesTool } from "../index.js";

describe("get-facilities tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getFacilitiesTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
