import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-users-in-organization output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with users and hasNext", () => {
    const validOutput = {
      result: {
        users: [
          {
            id: "123",
            name: "John Doe",
            code: "john.doe",
          },
        ],
        hasNext: false,
      },
    };

    const result = schema.parse(validOutput);

    expect(result).toEqual(validOutput);
  });

  it("should fail with missing users", () => {
    const invalidOutput = {
      result: {
        hasNext: false,
      },
    };

    expect(() => schema.parse(invalidOutput)).toThrow();
  });

  it("should fail with missing hasNext", () => {
    const invalidOutput = {
      result: {
        users: [],
      },
    };

    expect(() => schema.parse(invalidOutput)).toThrow();
  });

  it("should fail with invalid user object", () => {
    const invalidOutput = {
      result: {
        users: [
          {
            id: "123",
            // missing name and code
          },
        ],
        hasNext: false,
      },
    };
    expect(() => schema.parse(invalidOutput)).toThrow();
  });

  it("should fail with non-boolean hasNext", () => {
    const invalidOutput = {
      result: {
        users: [],
        hasNext: "false",
      },
    };
    expect(() => schema.parse(invalidOutput)).toThrow();
  });
});
