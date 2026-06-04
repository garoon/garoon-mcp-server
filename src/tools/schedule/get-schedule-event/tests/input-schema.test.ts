import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("get-schedule-event input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with eventId", () => {
    const validInput = {
      eventId: "123",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing eventId", () => {
    const invalidInput = {};

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject non-string eventId", () => {
    const invalidInput = {
      eventId: 123,
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });
});
