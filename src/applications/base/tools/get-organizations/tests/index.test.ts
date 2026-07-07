import { describe, it, expect } from "vitest";
import { getOrganizationsTool } from "../index.js";

describe("get-organizations tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getOrganizationsTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
