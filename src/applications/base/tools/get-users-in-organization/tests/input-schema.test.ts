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

    it("should reject non-numeric organizationId", () => {
      const invalidIds = ["", "abc", "12a", "-1"];

      invalidIds.forEach((organizationId) => {
        const result = schema.safeParse({ organizationId });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain("organizationId");
        }
      });
    });
  });

  describe("limit param", () => {
    it("should validate limit as integer", () => {
      const validInput = {
        organizationId: "123",
        limit: 50,
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });

    it("should fail with limit as string", () => {
      const invalidInput = {
        organizationId: "123",
        limit: "50",
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject out-of-range limit values", () => {
      const invalidInputs = [
        { organizationId: "123", limit: 0 },
        { organizationId: "123", limit: 1001 },
      ];

      invalidInputs.forEach((input) => {
        const result = schema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain("limit");
        }
      });
    });
  });

  describe("offset param", () => {
    it("should validate offset as integer", () => {
      const validInput = {
        organizationId: "123",
        offset: 0,
      };

      const result = schema.parse(validInput);

      expect(result).toEqual(validInput);
    });

    it("should fail with offset as string", () => {
      const invalidInput = {
        organizationId: "123",
        offset: "0",
      };

      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject negative offset value", () => {
      const result = schema.safeParse({ organizationId: "123", offset: -1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("offset");
      }
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
