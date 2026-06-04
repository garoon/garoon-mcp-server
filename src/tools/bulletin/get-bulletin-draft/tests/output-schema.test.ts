import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-bulletin-draft output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with all fields", () => {
    const validOutput = {
      result: {
        id: "1",
        subject: "Draft Topic",
        body: "Draft body",
        isHtmlBody: false,
        isDraft: true,
        category: { id: "10", name: "General" },
        creator: { id: "1", code: "user1", name: "User 1" },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate minimal output", () => {
    const validOutput = {
      result: {
        id: "1",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate error output", () => {
    const validOutput = {
      error: "Some error message",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should accept empty object (both result and error are optional)", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
  });

  it("should reject invalid operatorType in result", () => {
    const invalidOutput = {
      result: {
        id: "1",
        operatorType: "INVALID",
      },
    };

    expect(() => schema.parse(invalidOutput)).toThrow();
  });
});
