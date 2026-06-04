import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("delete-schedule-datastore output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate success output", () => {
    const validOutput = {
      result: {
        success: true,
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

  it("should accept empty object", () => {
    expect(() => schema.parse({})).not.toThrow();
  });

  it("should reject invalid success value", () => {
    const invalidOutput = {
      result: {
        success: "yes",
      },
    };

    expect(() => schema.parse(invalidOutput)).toThrow();
  });
});
