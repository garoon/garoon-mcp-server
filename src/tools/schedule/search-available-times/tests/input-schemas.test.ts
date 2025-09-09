import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  inputSchema,
  attendeeInputSchema,
  facilityInputSchema,
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

    it("should validate attendee with both id and code (id takes precedence)", () => {
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

  describe("inputSchema", () => {
    it("should validate complete valid input", () => {
      const validInput = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
          {
            start: "2024-07-28T09:00:00+09:00",
            end: "2024-07-28T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        attendees: [
          { type: "USER", id: "1" },
          { type: "USER", code: "user2" },
          { type: "ORGANIZATION", id: "3", code: "org3" },
        ],
        facilities: [{ id: "1" }, { code: "room2" }],
        facilitySearchCondition: "OR",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate minimal valid input", () => {
      const validInput = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should reject empty timeRanges", () => {
      const invalidInput = {
        timeRanges: [],
        timeInterval: 30,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject missing timeRanges", () => {
      const invalidInput = {
        timeInterval: 30,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject missing timeInterval", () => {
      const invalidInput = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject invalid facilitySearchCondition", () => {
      const invalidInput = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        facilitySearchCondition: "INVALID",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should accept valid facilitySearchCondition values", () => {
      const validInputs = [
        {
          timeRanges: [
            {
              start: "2024-07-27T09:00:00+09:00",
              end: "2024-07-27T18:00:00+09:00",
            },
          ],
          timeInterval: 30,
          facilitySearchCondition: "AND",
        },
        {
          timeRanges: [
            {
              start: "2024-07-27T09:00:00+09:00",
              end: "2024-07-27T18:00:00+09:00",
            },
          ],
          timeInterval: 30,
          facilitySearchCondition: "OR",
        },
      ];

      const schema = z.object(inputSchema);
      validInputs.forEach((input) => {
        expect(() => schema.parse(input)).not.toThrow();
      });
    });
  });
});
