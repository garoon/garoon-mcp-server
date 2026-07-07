import { describe, it, expect } from "vitest";
import { searchAvailableTimes } from "../index.js";

describe("search-available-times tool annotations", () => {
  // The underlying Garoon API is invoked with POST, but it only searches for
  // free time slots and never mutates Garoon state, so it is read-only.
  it("should declare read-only annotations", () => {
    expect(searchAvailableTimes.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
