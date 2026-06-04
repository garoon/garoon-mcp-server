import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("get-schedule-datastore input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input", () => {
    const validInput = {
      eventId: "123",
      customizeName: "myApp",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing eventId", () => {
    const invalidInput = {
      customizeName: "myApp",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject missing customizeName", () => {
    const invalidInput = {
      eventId: "123",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject empty object", () => {
    expect(() => schema.parse({})).toThrow();
  });
});
