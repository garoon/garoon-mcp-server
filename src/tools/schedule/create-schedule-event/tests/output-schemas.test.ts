import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schemas.js";

describe("output-schemas", () => {
  describe("outputSchema", () => {
    it("should validate valid output with all fields", () => {
      const validOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "REGULAR",
          eventMenu: "Meeting",
          subject: "Team Meeting",
          notes: "Weekly team sync",
          visibilityType: "PUBLIC",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T09:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T10:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [
            {
              type: "USER",
              id: "1",
              code: "user1",
              name: "User 1",
            },
            {
              type: "ORGANIZATION",
              id: "2",
              code: "org2",
              name: "Organization 2",
            },
          ],
          facilities: [
            {
              id: "1",
              code: "room1",
              name: "Conference Room A",
            },
          ],
          facilityUsingPurpose: "Meeting room booking",
          watchers: [
            {
              type: "USER",
              id: "3",
              code: "user3",
              name: "User 3",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate minimal valid output", () => {
      const validOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "REGULAR",
          subject: "Simple Event",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T09:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output without optional fields", () => {
      const validOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "REGULAR",
          subject: "Event without optional fields",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T09:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate isStartOnly event", () => {
      const validOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "REGULAR",
          subject: "Start Only Event",
          isStartOnly: true,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T09:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate all-day event", () => {
      const validOutput = {
        isError: false,
        result: {
          id: "12345",
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

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate error output", () => {
      const errorOutput = {
        isError: true,
        error: "Failed to create schedule event",
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(errorOutput)).not.toThrow();
    });

    it("should reject output with invalid eventType", () => {
      const invalidOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "INVALID",
          subject: "Test Event",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T09:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with missing required fields", () => {
      const invalidOutput = {
        isError: false,
        result: {
          id: "12345",
          // missing eventType, subject, start, etc.
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid time format", () => {
      const invalidOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "REGULAR",
          subject: "Test Event",
          isStartOnly: false,
          isAllDay: false,
          start: "invalid-time",
          attendees: [],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should validate attendees with all required fields", () => {
      const validOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "REGULAR",
          subject: "Test Event",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T09:00:00+09:00",
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
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should reject attendees with missing required fields", () => {
      const invalidOutput = {
        isError: false,
        result: {
          id: "12345",
          eventType: "REGULAR",
          subject: "Test Event",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T09:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [
            {
              type: "USER",
              id: "1",
              // missing code and name
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });
  });
});
