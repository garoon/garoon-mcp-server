import { describe, it, expect } from "vitest";
import { getUserInOrganizationTool } from "../index.js";

describe("get-users-in-organization tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getUserInOrganizationTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
