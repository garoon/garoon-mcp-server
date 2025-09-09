import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schemas.js";

describe("output-schemas", () => {
  describe("outputSchema", () => {
    it("should validate valid output with available times", () => {
      const validOutput = {
        isError: false,
        result: {
          availableTimes: [
            {
              start: {
                dateTime: "2024-07-27T09:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
            {
              start: {
                dateTime: "2024-07-27T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T10:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
            {
              start: {
                dateTime: "2024-07-27T14:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T14:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output with facility information", () => {
      const validOutputWithFacility = {
        isError: false,
        result: {
          availableTimes: [
            {
              start: {
                dateTime: "2024-07-27T09:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              facility: {
                id: "1",
                code: "f1",
                name: "f1",
              },
            },
            {
              start: {
                dateTime: "2024-07-27T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T10:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutputWithFacility)).not.toThrow();
    });

    it("should validate empty available times", () => {
      const validEmptyOutput = {
        isError: false,
        result: {
          availableTimes: [],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validEmptyOutput)).not.toThrow();
    });

    it("should validate error output", () => {
      const errorOutput = {
        isError: true,
        error: "Some error message",
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(errorOutput)).not.toThrow();
    });

    it("should reject output without isError", () => {
      const invalidOutput = {
        result: {
          availableTimes: [
            {
              start: {
                dateTime: "2024-07-27T09:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid availableTimes format", () => {
      const invalidOutput = {
        isError: false,
        result: {
          availableTimes: "invalid",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid time format", () => {
      const invalidOutput = {
        isError: false,
        result: {
          availableTimes: [
            {
              start: "invalid-time",
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with missing timeZone", () => {
      const invalidOutput = {
        isError: false,
        result: {
          availableTimes: [
            {
              start: {
                dateTime: "2024-07-27T09:00:00+09:00",
              },
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should validate facility with all required fields", () => {
      const validOutputWithCompleteFacility = {
        isError: false,
        result: {
          availableTimes: [
            {
              start: {
                dateTime: "2024-07-27T09:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              facility: {
                id: "123",
                code: "room-abc",
                name: "Conference Room A",
              },
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutputWithCompleteFacility)).not.toThrow();
    });

    it("should reject facility with missing required fields", () => {
      const invalidOutputWithIncompleteFacility = {
        isError: false,
        result: {
          availableTimes: [
            {
              start: {
                dateTime: "2024-07-27T09:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              facility: {
                id: "123",
                // missing code and name
              },
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutputWithIncompleteFacility)).toThrow();
    });
  });
});
