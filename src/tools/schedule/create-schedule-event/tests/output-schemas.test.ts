import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schemas.js";

describe("create-schedule-event output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with all fields", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "REGULAR",
        eventMenu: "Meeting",
        subject: "Test Event",
        notes: "Test notes",
        visibilityType: "PUBLIC",
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
        facilities: [
          {
            id: "1",
            code: "f1",
            name: "f1",
          },
        ],
        facilityUsingPurpose: "Meeting room",
        watchers: [
          {
            type: "USER",
            id: "2",
            code: "user2",
            name: "User 2",
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

  it("should reject invalid result structure", () => {
    const invalidOutputs = [
      {
        result: {
          id: "123",
          eventType: "INVALID",
          subject: "Test Event",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T11:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [],
        },
      },
      {
        result: {
          id: "123",
          eventType: "REGULAR",
          subject: "Test Event",
          isStartOnly: "invalid",
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T11:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [],
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should validate ALL_DAY event type", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "ALL_DAY",
        subject: "All Day Event",
        isStartOnly: false,
        isAllDay: true,
        start: {
          dateTime: "2024-07-27T00:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T23:59:59+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate start-only event", () => {
    const validOutput = {
      result: {
        id: "123",
        eventType: "REGULAR",
        subject: "Start Only Event",
        isStartOnly: true,
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
});
