import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("update-schedule-event output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "REGULAR",
        subject: "Updated Event",
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

  it("should accept empty object", () => {
    expect(() => schema.parse({})).not.toThrow();
  });

  it("should validate output with extended fields", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "REGULAR",
        subject: "Test",
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [],
        useAttendanceCheck: true,
        companyInfo: {
          name: "Corp",
        },
        attachments: [
          {
            id: "1",
            name: "file.pdf",
            contentType: "application/pdf",
            size: "2048",
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
