import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("get-users-in-organization input schema", () => {
  const schema = z.object(inputSchema);

  describe("organizationId param", () => {
    it("should validate required organizationId", () => {
      const validInput = {
        organizationId: "123",
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });

    it("should fail with missing organizationId", () => {
      const invalidInput = {};

      expect(() => schema.parse(invalidInput)).toThrow();
    });
  });

  describe("limit param", () => {
    it("should validate limit as positive integer", () => {
      const validInput = {
        organizationId: "123",
        limit: 50,
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });

    it("should validate limit with minimum value (1)", () => {
      const validInput = {
        organizationId: "123",
        limit: 1,
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });

    it("should validate limit with maximum value (1000)", () => {
      const validInput = {
        organizationId: "123",
        limit: 1000,
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });

    it("should fail with limit = 0", () => {
      const invalidInput = {
        organizationId: "123",
        limit: 0,
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should fail with negative limit", () => {
      const invalidInput = {
        organizationId: "123",
        limit: -1,
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should fail with limit > 1000", () => {
      const invalidInput = {
        organizationId: "123",
        limit: 1001,
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should fail with non-integer limit", () => {
      const invalidInput = {
        organizationId: "123",
        limit: 10.5,
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });
  });

  describe("offset param", () => {
    it("should validate offset as non-negative integer", () => {
      const validInput = {
        organizationId: "123",
        offset: 0,
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });

    it("should fail with negative offset", () => {
      const invalidInput = {
        organizationId: "123",
        offset: -1,
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should fail with non-integer offset", () => {
      const invalidInput = {
        organizationId: "123",
        offset: 5.5,
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });
  });

  describe("combined parameters", () => {
    it("should validate with optional limit and offset", () => {
      const validInput = {
        organizationId: "123",
        limit: 10,
        offset: 0,
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });
  });
});
