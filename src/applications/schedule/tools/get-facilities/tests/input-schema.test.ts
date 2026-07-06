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

  it("should accept limit boundary values", () => {
    expect(() => schema.parse({ name: "Room", limit: 1 })).not.toThrow();
    expect(() => schema.parse({ name: "Room", limit: 1000 })).not.toThrow();
  });

  it("should reject out-of-range limit values", () => {
    const invalidInputs = [
      { name: "Room", limit: 0 },
      { name: "Room", limit: -1 },
      { name: "Room", limit: 1001 },
      { name: "Room", limit: 1.5 },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("limit");
      }
    });
  });

  it("should accept offset boundary value", () => {
    expect(() => schema.parse({ name: "Room", offset: 0 })).not.toThrow();
  });

  it("should reject out-of-range offset values", () => {
    const invalidInputs = [
      { name: "Room", offset: -1 },
      { name: "Room", offset: 0.5 },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("offset");
      }
    });
  });
});
