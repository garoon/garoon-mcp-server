import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("update-schedule-datastore output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with value", () => {
    const validOutput = {
      result: {
        value: {
          key1: "updated",
          key2: 100,
        },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate output with empty value", () => {
    const validOutput = {
      result: {
        value: {},
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
});
