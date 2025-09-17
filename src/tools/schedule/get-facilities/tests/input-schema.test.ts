import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("get-facilities input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with name only", () => {
    const validInput = {
      name: "Conference Room",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with name and limit", () => {
    const validInput = {
      name: "Meeting Room",
      limit: 10,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with name and offset", () => {
    const validInput = {
      name: "Training Room",
      offset: 5,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with all parameters", () => {
    const validInput = {
      name: "Board Room",
      limit: 20,
      offset: 10,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with Japanese characters in name", () => {
    const validInput = {
      name: "会議室",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with special characters in name", () => {
    const validInput = {
      name: "Room-101 & Room-102",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with numeric name", () => {
    const validInput = {
      name: "101",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with empty string name", () => {
    const validInput = {
      name: "",
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

  it("should reject invalid limit type", () => {
    const invalidInputs = [
      { name: "Room", limit: "10" },
      { name: "Room", limit: true },
      { name: "Room", limit: {} },
      { name: "Room", limit: [] },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid offset type", () => {
    const invalidInputs = [
      { name: "Room", offset: "5" },
      { name: "Room", offset: true },
      { name: "Room", offset: {} },
      { name: "Room", offset: [] },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should accept negative limit values", () => {
    const validInput = {
      name: "Room",
      limit: -1,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should accept negative offset values", () => {
    const validInput = {
      name: "Room",
      offset: -5,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should accept zero values for limit and offset", () => {
    const validInput = {
      name: "Room",
      limit: 0,
      offset: 0,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should accept large numeric values", () => {
    const validInput = {
      name: "Room",
      limit: 999999,
      offset: 999999,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });
});
