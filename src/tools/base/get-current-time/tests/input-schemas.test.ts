import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("get-current-time input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with timezone", () => {
    const validInput = {
      timezone: "Asia/Tokyo",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input without timezone", () => {
    const validInput = {};

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate undefined timezone", () => {
    const validInput = {
      timezone: undefined,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate empty string timezone", () => {
    const validInput = {
      timezone: "",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate various timezone formats", () => {
    const validInputs = [
      { timezone: "UTC" },
      { timezone: "America/New_York" },
      { timezone: "Europe/London" },
      { timezone: "Asia/Tokyo" },
      { timezone: "Australia/Sydney" },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should reject invalid timezone type", () => {
    const invalidInputs = [
      { timezone: 123 },
      { timezone: true },
      { timezone: {} },
      { timezone: [] },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });
});
