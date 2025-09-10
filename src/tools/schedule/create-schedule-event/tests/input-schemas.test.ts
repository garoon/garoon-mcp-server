import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("create-schedule-event input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with required fields only", () => {
    const validInput = {
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with all fields", () => {
    const validInput = {
      subject: "Test Event",
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T12:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      isStartOnly: false,
      isAllDay: false,
      eventType: "REGULAR",
      eventMenu: "Meeting",
      notes: "Test notes",
      visibilityType: "PUBLIC",
      attendees: [
        { type: "USER", id: "1" },
        { type: "USER", code: "user2" },
      ],
      facilities: [{ id: "1" }, { code: "facility2" }],
      facilityUsingPurpose: "Meeting room",
      watchers: [
        { type: "USER", id: "3" },
        { type: "ORGANIZATION", code: "org1" },
      ],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate attendees with id or code", () => {
    const validInputs = [
      {
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [{ type: "USER", id: "1" }],
      },
      {
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [{ type: "USER", code: "user1" }],
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate facilities with id or code", () => {
    const validInputs = [
      {
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        facilities: [{ id: "1" }],
      },
      {
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        facilities: [{ code: "facility1" }],
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate watchers with id or code", () => {
    const validInputs = [
      {
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        watchers: [{ type: "USER", id: "1" }],
      },
      {
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        watchers: [{ type: "ORGANIZATION", code: "org1" }],
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should reject missing required start field", () => {
    const invalidInput = {};

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject attendees without id or code", () => {
    const invalidInput = {
      start: { dateTime: "2024-07-27T11:00:00+09:00", timeZone: "Asia/Tokyo" },
      attendees: [{ type: "USER" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject facilities without id or code", () => {
    const invalidInput = {
      start: { dateTime: "2024-07-27T11:00:00+09:00", timeZone: "Asia/Tokyo" },
      facilities: [{}],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject watchers without id or code", () => {
    const invalidInput = {
      start: { dateTime: "2024-07-27T11:00:00+09:00", timeZone: "Asia/Tokyo" },
      watchers: [{ type: "USER" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid attendee type", () => {
    const invalidInput = {
      start: { dateTime: "2024-07-27T11:00:00+09:00", timeZone: "Asia/Tokyo" },
      attendees: [{ type: "INVALID", id: "1" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid watcher type", () => {
    const invalidInput = {
      start: { dateTime: "2024-07-27T11:00:00+09:00", timeZone: "Asia/Tokyo" },
      watchers: [{ type: "INVALID", id: "1" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid eventType", () => {
    const invalidInput = {
      start: { dateTime: "2024-07-27T11:00:00+09:00", timeZone: "Asia/Tokyo" },
      eventType: "INVALID",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid visibilityType", () => {
    const invalidInput = {
      start: { dateTime: "2024-07-27T11:00:00+09:00", timeZone: "Asia/Tokyo" },
      visibilityType: "INVALID",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });
});
