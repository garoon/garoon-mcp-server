import { describe, it, expect } from "vitest";
import { getScheduleEventComments } from "../index.js";

describe("get-schedule-event-comments tool", () => {
  it("should have the expected name", () => {
    expect(getScheduleEventComments.name).toBe(
      "garoon-get-schedule-event-comments",
    );
  });

  it("should declare read-only annotations", () => {
    expect(getScheduleEventComments.config.annotations).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
    });
  });
});
