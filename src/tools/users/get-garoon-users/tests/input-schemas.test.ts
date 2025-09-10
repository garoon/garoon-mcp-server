import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("input-schemas", () => {
  describe("inputSchema", () => {
    it("should validate input with display name", () => {
      const validInput = {
        name: "田中太郎",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with user code", () => {
      const validInput = {
        name: "t-tanaka",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with English name", () => {
      const validInput = {
        name: "Sara Brown",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with numeric user code", () => {
      const validInput = {
        name: "user123",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with mixed characters", () => {
      const validInput = {
        name: "user_123-abc",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with special characters", () => {
      const validInput = {
        name: "user@domain.com",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with spaces", () => {
      const validInput = {
        name: "John Doe",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should validate input with empty string", () => {
      const validInput = {
        name: "",
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(validInput)).not.toThrow();
    });

    it("should reject missing name", () => {
      const invalidInput = {};

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject non-string name", () => {
      const invalidInput = {
        name: 123,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject null name", () => {
      const invalidInput = {
        name: null,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject undefined name", () => {
      const invalidInput = {
        name: undefined,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject boolean name", () => {
      const invalidInput = {
        name: true,
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject array name", () => {
      const invalidInput = {
        name: ["John", "Doe"],
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });

    it("should reject object name", () => {
      const invalidInput = {
        name: { first: "John", last: "Doe" },
      };

      const schema = z.object(inputSchema);
      expect(() => schema.parse(invalidInput)).toThrow();
    });
  });
});
