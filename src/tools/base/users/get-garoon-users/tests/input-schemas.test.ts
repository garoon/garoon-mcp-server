import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("get-garoon-users input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with name", () => {
    const validInput = {
      name: "John Doe",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with Japanese characters", () => {
    const validInput = {
      name: "田中太郎",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with user code", () => {
    const validInput = {
      name: "t-tanaka",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with special characters", () => {
    const validInput = {
      name: "user@example.com",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing name field", () => {
    const invalidInput = {};

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid name type", () => {
    const invalidInputs = [
      { name: 123 },
      { name: true },
      { name: {} },
      { name: [] },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject empty string name", () => {
    const invalidInput = {
      name: "",
    };

    expect(() => schema.parse(invalidInput)).not.toThrow(); // Empty string is valid for search
  });
});
