import { describe, it, expect } from "vitest";
import { getScheduleEvents } from "../index.js";

describe("get-schedule-events tool annotations", () => {
  it("should declare read-only annotations", () => {
    expect(getScheduleEvents.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
