import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schemas.js";

describe("output-schemas", () => {
  describe("outputSchema", () => {
    it("should validate valid output with timezone and datetime", () => {
      const validOutput = {
        isError: false,
        result: {
          timezone: "Asia/Tokyo",
          datetime: "2024-07-27T11:00:00+09:00",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output with UTC timezone", () => {
      const validOutput = {
        isError: false,
        result: {
          timezone: "UTC",
          datetime: "2024-07-27T02:00:00Z",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output with various timezone formats", () => {
      const timezones = [
        "America/New_York",
        "Europe/London",
        "Australia/Sydney",
        "Pacific/Auckland",
      ];

      const schema = z.object(outputSchema);
      timezones.forEach((timezone) => {
        const validOutput = {
          isError: false,
          result: {
            timezone,
            datetime: "2024-07-27T11:00:00+09:00",
          },
        };
        expect(() => schema.parse(validOutput)).not.toThrow();
      });
    });

    it("should validate output with different datetime formats", () => {
      const datetimes = [
        "2024-07-27T11:00:00+09:00",
        "2024-07-27T02:00:00Z",
        "2024-12-31T23:59:59-05:00",
        "2024-01-01T00:00:00+00:00",
      ];

      const schema = z.object(outputSchema);
      datetimes.forEach((datetime) => {
        const validOutput = {
          isError: false,
          result: {
            timezone: "UTC",
            datetime,
          },
        };
        expect(() => schema.parse(validOutput)).not.toThrow();
      });
    });

    it("should validate error output", () => {
      const errorOutput = {
        isError: true,
        error: "Unsupported timezone: Invalid/Timezone",
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(errorOutput)).not.toThrow();
    });

    it("should reject output with missing timezone", () => {
      const invalidOutput = {
        isError: false,
        result: {
          datetime: "2024-07-27T11:00:00+09:00",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with missing datetime", () => {
      const invalidOutput = {
        isError: false,
        result: {
          timezone: "Asia/Tokyo",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with non-string timezone", () => {
      const invalidOutput = {
        isError: false,
        result: {
          timezone: 123,
          datetime: "2024-07-27T11:00:00+09:00",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with non-string datetime", () => {
      const invalidOutput = {
        isError: false,
        result: {
          timezone: "Asia/Tokyo",
          datetime: 20240727,
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should accept output with empty timezone (schema allows empty strings)", () => {
      const validOutput = {
        isError: false,
        result: {
          timezone: "",
          datetime: "2024-07-27T11:00:00+09:00",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should accept output with empty datetime (schema allows empty strings)", () => {
      const validOutput = {
        isError: false,
        result: {
          timezone: "Asia/Tokyo",
          datetime: "",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should accept output with any datetime format (schema allows any string)", () => {
      const validOutput = {
        isError: false,
        result: {
          timezone: "Asia/Tokyo",
          datetime: "invalid-datetime",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should accept output with missing result (result is optional in schema)", () => {
      const validOutput = {
        isError: false,
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should reject output with missing isError", () => {
      const invalidOutput = {
        result: {
          timezone: "Asia/Tokyo",
          datetime: "2024-07-27T11:00:00+09:00",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });
  });
});
