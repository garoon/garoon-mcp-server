import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("update-schedule-event input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate input with eventId only", () => {
    const validInput = {
      eventId: "123",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with all optional fields", () => {
    const validInput = {
      eventId: "123",
      subject: "Updated Event",
      notes: "Some notes",
      eventMenu: "Meeting",
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T12:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      isAllDay: false,
      isStartOnly: false,
      visibilityType: "PUBLIC",
      attendees: [{ type: "USER", id: "1" }],
      facilities: [{ id: "1" }],
      facilityUsingPurpose: "Meeting",
      watchers: [{ type: "USER", id: "2" }],
      companyInfo: { name: "Test Corp" },
      useAttendanceCheck: true,
      notifyAttendees: true,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing eventId", () => {
    const invalidInput = {
      subject: "Test",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid visibilityType", () => {
    const invalidInput = {
      eventId: "123",
      visibilityType: "INVALID",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject attendees without id or code", () => {
    const invalidInput = {
      eventId: "123",
      attendees: [{ type: "USER" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });
});
