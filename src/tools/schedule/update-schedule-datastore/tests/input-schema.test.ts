import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("update-schedule-datastore input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input", () => {
    const validInput = {
      eventId: "123",
      customizeName: "myApp",
      value: { key1: "value1" },
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing eventId", () => {
    const invalidInput = {
      customizeName: "myApp",
      value: { key1: "value1" },
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject missing customizeName", () => {
    const invalidInput = {
      eventId: "123",
      value: { key1: "value1" },
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject missing value", () => {
    const invalidInput = {
      eventId: "123",
      customizeName: "myApp",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should accept empty value object", () => {
    const validInput = {
      eventId: "123",
      customizeName: "myApp",
      value: {},
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });
});
