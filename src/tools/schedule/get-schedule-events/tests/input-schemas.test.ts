import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("input-schemas", () => {
  describe("inputSchema", () => {
    it("should validate complete valid input", () => {
      const validInput = {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate with numeric string userId", () => {
      const validInput = {
        userId: "12345",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should reject missing userId", () => {
      const invalidInput = {
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject missing rangeStart", () => {
      const invalidInput = {
        userId: "123",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject missing rangeEnd", () => {
      const invalidInput = {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject non-string userId", () => {
      const invalidInput = {
        userId: 123,
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject non-string rangeStart", () => {
      const invalidInput = {
        userId: "123",
        rangeStart: 20240101,
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject non-string rangeEnd", () => {
      const invalidInput = {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: 20240107,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should accept empty userId (schema allows empty strings)", () => {
      const validInput = {
        userId: "",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should accept empty rangeStart (schema allows empty strings)", () => {
      const validInput = {
        userId: "123",
        rangeStart: "",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should accept empty rangeEnd (schema allows empty strings)", () => {
      const validInput = {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });
  });
});
