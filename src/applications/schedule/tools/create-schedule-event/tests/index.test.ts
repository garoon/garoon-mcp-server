import { describe, it, expect } from "vitest";
import { createScheduleEvent } from "../index.js";

describe("create-schedule-event tool annotations", () => {
  // Re-running this tool creates a duplicate event, so it is not idempotent.
  it("should declare non-read-only, non-idempotent annotations", () => {
    expect(createScheduleEvent.config.annotations).toEqual({
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    });
  });
});
