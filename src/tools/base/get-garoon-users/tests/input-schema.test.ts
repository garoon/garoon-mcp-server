import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

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

  it("should allow missing name field (optional)", () => {
    const validInput = {};

    expect(() => schema.parse(validInput)).not.toThrow();
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

    expect(() => schema.parse(invalidInput)).not.toThrow();
  });

  it("should validate input with limit parameter", () => {
    const validInput = {
      name: "John",
      limit: 10,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with offset parameter", () => {
    const validInput = {
      name: "John",
      offset: 20,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with both limit and offset", () => {
    const validInput = {
      name: "John",
      limit: 10,
      offset: 20,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with pagination but no name", () => {
    const validInput = {
      limit: 5,
      offset: 0,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject invalid limit type", () => {
    const invalidInputs = [
      { limit: "10" },
      { limit: true },
      { limit: {} },
      { limit: [] },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid offset type", () => {
    const invalidInputs = [
      { offset: "20" },
      { offset: true },
      { offset: {} },
      { offset: [] },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });
});
