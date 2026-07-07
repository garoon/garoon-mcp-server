import { describe, it, expect } from "vitest";
import { getCurrentTimeTool } from "../index.js";

describe("get-current-time tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getCurrentTimeTool.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
