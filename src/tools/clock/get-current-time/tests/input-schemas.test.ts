import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("input-schemas", () => {
  describe("inputSchema", () => {
    it("should validate input with timezone", () => {
      const validInput = {
        timezone: "Asia/Tokyo",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input without timezone (optional)", () => {
      const validInput = {};

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with undefined timezone", () => {
      const validInput = {
        timezone: undefined,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with empty string timezone", () => {
      const validInput = {
        timezone: "",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with various timezone formats", () => {
      const timezones = [
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney",
        "Pacific/Auckland",
      ];

      const schema = z.object(inputSchema);
      timezones.forEach((timezone) => {
        const validInput = { timezone };
        expect(() => schema.parse(validInput)).not.toThrow();
      });
    });

    it("should reject non-string timezone", () => {
      const invalidInput = {
        timezone: 123,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject null timezone", () => {
      const invalidInput = {
        timezone: null,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject boolean timezone", () => {
      const invalidInput = {
        timezone: true,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject array timezone", () => {
      const invalidInput = {
        timezone: ["Asia/Tokyo"],
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject object timezone", () => {
      const invalidInput = {
        timezone: { name: "Asia/Tokyo" },
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });
  });
});
