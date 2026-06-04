import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-schedule-event output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with all fields", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "REGULAR",
        subject: "Test Event",
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T12:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [
          {
            type: "USER",
            id: "1",
            code: "user1",
            name: "User 1",
          },
        ],
        useAttendanceCheck: true,
        companyInfo: {
          name: "Test Corp",
          phone: "03-1234-5678",
        },
        attachments: [
          {
            id: "1",
            name: "doc.pdf",
            contentType: "application/pdf",
            size: "1024",
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate minimal output", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "REGULAR",
        subject: "Test Event",
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate error output", () => {
    const validOutput = {
      error: "Some error message",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should accept empty object (both result and error are optional)", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
  });

  it("should validate REPEATING event type in response", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "REPEATING",
        subject: "Recurring Event",
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [],
        repeatInfo: { type: "EVERY_WEEK" },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
