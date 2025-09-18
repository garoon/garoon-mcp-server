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
