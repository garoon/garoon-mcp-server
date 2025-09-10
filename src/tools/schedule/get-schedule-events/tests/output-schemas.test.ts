import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schemas.js";

describe("output-schemas", () => {
  describe("outputSchema", () => {
    it("should validate valid output with events", () => {
      const validOutput = {
        isError: false,
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-01-01T11:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "Test notes",
            },
          ],
          hasNext: false,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output with multiple events", () => {
      const validOutput = {
        isError: false,
        result: {
          events: [
            {
              id: "1",
              subject: "Event 1",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-01-01T11:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "First event",
            },
            {
              id: "2",
              subject: "Event 2",
              start: {
                dateTime: "2024-01-02T14:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-01-02T15:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "Second event",
            },
          ],
          hasNext: true,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output with empty events array", () => {
      const validOutput = {
        isError: false,
        result: {
          events: [],
          hasNext: false,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate error output", () => {
      const errorOutput = {
        isError: true,
        error: "Failed to search schedule events",
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(errorOutput)).not.toThrow();
    });

    it("should reject output with missing events", () => {
      const invalidOutput = {
        isError: false,
        result: {
          hasNext: false,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with missing hasNext", () => {
      const invalidOutput = {
        isError: false,
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-01-01T11:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "Test notes",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid event structure", () => {
      const invalidOutput = {
        isError: false,
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              // missing start, end, notes
            },
          ],
          hasNext: false,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid hasNext type", () => {
      const invalidOutput = {
        isError: false,
        result: {
          events: [],
          hasNext: "false", // should be boolean
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid event id", () => {
      const invalidOutput = {
        isError: false,
        result: {
          events: [
            {
              id: 123, // should be string
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-01-01T11:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "Test notes",
            },
          ],
          hasNext: false,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid time format", () => {
      const invalidOutput = {
        isError: false,
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: "invalid-time",
              end: {
                dateTime: "2024-01-01T11:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "Test notes",
            },
          ],
          hasNext: false,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });
  });
});
