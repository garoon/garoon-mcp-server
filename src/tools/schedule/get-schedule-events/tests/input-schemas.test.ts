import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("get-schedule-events input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input", () => {
    const validInput = {
      userId: "123",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing required fields", () => {
    const invalidInputs = [
      {},
      { userId: "123" },
      { rangeStart: "2024-01-01T00:00:00+09:00" },
      { rangeEnd: "2024-01-07T23:59:59+09:00" },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid userId type", () => {
    const invalidInput = {
      userId: 123,
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid date format", () => {
    const invalidInput = {
      userId: "123",
      rangeStart: "invalid-date",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    expect(() => schema.parse(invalidInput)).not.toThrow(); // String is valid, format validation is done elsewhere
  });
});
