import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("get-organizations input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with name only", () => {
    const validInput = {
      name: "Sales Department",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with all parameters", () => {
    const validInput = {
      name: "Engineering",
      limit: 50,
      offset: 10,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with Japanese characters", () => {
    const validInput = {
      name: "営業部",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with special characters", () => {
    const validInput = {
      name: "R&D Department",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate limit boundary values", () => {
    const validInputs = [
      { name: "Test", limit: 1 },
      { name: "Test", limit: 1000 },
      { name: "Test", limit: 50 },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate offset boundary values", () => {
    const validInputs = [
      { name: "Test", offset: 0 },
      { name: "Test", offset: 100 },
      { name: "Test", offset: 999999 },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should reject missing name field", () => {
    const invalidInputs = [
      {},
      { limit: 10 },
      { offset: 0 },
      { limit: 10, offset: 0 },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid name type", () => {
    const invalidInputs = [
      { name: 123 },
      { name: true },
      { name: {} },
      { name: [] },
      { name: null },
      { name: undefined },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid limit values", () => {
    const invalidInputs = [
      { name: "Test", limit: 0 },
      { name: "Test", limit: 1001 },
      { name: "Test", limit: -1 },
      { name: "Test", limit: 1.5 },
      { name: "Test", limit: "10" },
      { name: "Test", limit: true },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid offset values", () => {
    const invalidInputs = [
      { name: "Test", offset: -1 },
      { name: "Test", offset: 1.5 },
      { name: "Test", offset: "10" },
      { name: "Test", offset: true },
      { name: "Test", offset: null },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should accept empty string name", () => {
    const validInput = {
      name: "",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should accept optional parameters as undefined", () => {
    const validInputs = [
      { name: "Test", limit: undefined },
      { name: "Test", offset: undefined },
      { name: "Test", limit: undefined, offset: undefined },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });
});
