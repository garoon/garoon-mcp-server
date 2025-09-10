import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  inputSchema,
  attendeeInputSchema,
  facilityInputSchema,
  watcherInputSchema,
} from "../input-schemas.js";

describe("input-schemas", () => {
  describe("attendeeInputSchema", () => {
    it("should validate attendee with id", () => {
      const validAttendee = {
        type: "USER" as const,
        id: "123",
      };

      expect(() => attendeeInputSchema.parse(validAttendee)).not.toThrow();
    });

    it("should validate attendee with code", () => {
      const validAttendee = {
        type: "ORGANIZATION" as const,
        code: "org123",
      };

      expect(() => attendeeInputSchema.parse(validAttendee)).not.toThrow();
    });

    it("should validate attendee with both id and code", () => {
      const validAttendee = {
        type: "USER" as const,
        id: "123",
        code: "user123",
      };

      expect(() => attendeeInputSchema.parse(validAttendee)).not.toThrow();
    });

    it("should reject attendee without id or code", () => {
      const invalidAttendee = {
        type: "USER" as const,
      };

      expect(() => attendeeInputSchema.parse(invalidAttendee)).toThrow();
    });

    it("should reject attendee with invalid type", () => {
      const invalidAttendee = {
        type: "INVALID" as any,
        id: "123",
      };

      expect(() => attendeeInputSchema.parse(invalidAttendee)).toThrow();
    });
  });

  describe("facilityInputSchema", () => {
    it("should validate facility with id", () => {
      const validFacility = {
        id: "456",
      };

      expect(() => facilityInputSchema.parse(validFacility)).not.toThrow();
    });

    it("should validate facility with code", () => {
      const validFacility = {
        code: "room123",
      };

      expect(() => facilityInputSchema.parse(validFacility)).not.toThrow();
    });

    it("should validate facility with both id and code", () => {
      const validFacility = {
        id: "456",
        code: "room123",
      };

      expect(() => facilityInputSchema.parse(validFacility)).not.toThrow();
    });

    it("should reject facility without id or code", () => {
      const invalidFacility = {};

      expect(() => facilityInputSchema.parse(invalidFacility)).toThrow();
    });
  });

  describe("watcherInputSchema", () => {
    it("should validate watcher with id", () => {
      const validWatcher = {
        type: "USER" as const,
        id: "789",
      };

      expect(() => watcherInputSchema.parse(validWatcher)).not.toThrow();
    });

    it("should validate watcher with code", () => {
      const validWatcher = {
        type: "ROLE" as const,
        code: "admin",
      };

      expect(() => watcherInputSchema.parse(validWatcher)).not.toThrow();
    });

    it("should validate watcher with both id and code", () => {
      const validWatcher = {
        type: "ORGANIZATION" as const,
        id: "789",
        code: "org123",
      };

      expect(() => watcherInputSchema.parse(validWatcher)).not.toThrow();
    });

    it("should reject watcher without id or code", () => {
      const invalidWatcher = {
        type: "USER" as const,
      };

      expect(() => watcherInputSchema.parse(invalidWatcher)).toThrow();
    });

    it("should reject watcher with invalid type", () => {
      const invalidWatcher = {
        type: "INVALID" as any,
        id: "789",
      };

      expect(() => watcherInputSchema.parse(invalidWatcher)).toThrow();
    });
  });

  describe("inputSchema", () => {
    it("should validate complete valid input", () => {
      const validInput = {
        subject: "Team Meeting",
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T10:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        eventType: "REGULAR" as const,
        eventMenu: "Meeting",
        notes: "Weekly team sync",
        visibilityType: "PUBLIC" as const,
        isStartOnly: false,
        isAllDay: false,
        attendees: [
          { type: "USER" as const, id: "1" },
          { type: "USER" as const, code: "user2" },
          { type: "ORGANIZATION" as const, id: "3", code: "org3" },
        ],
        facilities: [{ id: "1" }, { code: "room2" }],
        facilityUsingPurpose: "Meeting room booking",
        watchers: [
          { type: "USER" as const, id: "4" },
          { type: "ROLE" as const, code: "admin" },
        ],
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate minimal valid input", () => {
      const validInput = {
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should apply default values", () => {
      const input = {
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
      };

      const schema = z.object(inputSchema);
      const result = schema.parse(input);

      expect(result.subject).toBe("New Schedule");
      expect(result.eventType).toBe("REGULAR");
      expect(result.visibilityType).toBe("PUBLIC");
      expect(result.isStartOnly).toBe(false);
      expect(result.isAllDay).toBe(false);
    });

    it("should reject missing start", () => {
      const invalidInput = {
        subject: "Test Event",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject invalid eventType", () => {
      const invalidInput = {
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        eventType: "INVALID",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject invalid visibilityType", () => {
      const invalidInput = {
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        visibilityType: "INVALID",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should validate isStartOnly with end time", () => {
      const validInput = {
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T10:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        isStartOnly: true,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate isAllDay event", () => {
      const validInput = {
        start: {
          dateTime: "2024-07-27T00:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T23:59:59+09:00",
          timeZone: "Asia/Tokyo",
        },
        isAllDay: true,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });
  });
});
