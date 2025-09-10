import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schemas.js";

describe("output-schemas", () => {
  describe("outputSchema", () => {
    it("should validate valid output with users", () => {
      const validOutput = {
        isError: false,
        result: {
          users: [
            {
              id: "123",
              name: "John Doe",
              code: "john.doe",
            },
            {
              id: "456",
              name: "田中太郎",
              code: "t-tanaka",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output with single user", () => {
      const validOutput = {
        isError: false,
        result: {
          users: [
            {
              id: "789",
              name: "Sara Brown",
              code: "sara.brown",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate output with empty users array", () => {
      const validOutput = {
        isError: false,
        result: {
          users: [],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate error output", () => {
      const errorOutput = {
        isError: true,
        error: "Failed to get users data",
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(errorOutput)).not.toThrow();
    });

    it("should validate output with missing result (result is optional in schema)", () => {
      const validOutput = {
        isError: false,
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should reject output with missing users", () => {
      const invalidOutput = {
        isError: false,
        result: {},
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with non-array users", () => {
      const invalidOutput = {
        isError: false,
        result: {
          users: "not an array",
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with invalid user structure", () => {
      const invalidOutput = {
        isError: false,
        result: {
          users: [
            {
              id: "123",
              // missing name and code
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with non-string user id", () => {
      const invalidOutput = {
        isError: false,
        result: {
          users: [
            {
              id: 123, // should be string
              name: "John Doe",
              code: "john.doe",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with non-string user name", () => {
      const invalidOutput = {
        isError: false,
        result: {
          users: [
            {
              id: "123",
              name: 123, // should be string
              code: "john.doe",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with non-string user code", () => {
      const invalidOutput = {
        isError: false,
        result: {
          users: [
            {
              id: "123",
              name: "John Doe",
              code: 123, // should be string
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should reject output with missing isError", () => {
      const invalidOutput = {
        result: {
          users: [
            {
              id: "123",
              name: "John Doe",
              code: "john.doe",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(invalidOutput)).toThrow();
    });

    it("should validate users with empty strings", () => {
      const validOutput = {
        isError: false,
        result: {
          users: [
            {
              id: "",
              name: "",
              code: "",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });

    it("should validate users with special characters", () => {
      const validOutput = {
        isError: false,
        result: {
          users: [
            {
              id: "123",
              name: "José María",
              code: "user@domain.com",
            },
          ],
        },
      };

      const schema = z.object(outputSchema);
      expect(() => schema.parse(validOutput)).not.toThrow();
    });
  });
});
