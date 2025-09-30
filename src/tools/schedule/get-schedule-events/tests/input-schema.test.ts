import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("get-schedule-events input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with user target", () => {
    const validInput = {
      target: "123",
      targetType: "user",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with organization target", () => {
    const validInput = {
      target: "456",
      targetType: "organization",
      rangeStart: "2024-12-01T00:00:00+09:00",
      rangeEnd: "2024-12-31T23:59:59+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with facility target", () => {
    const validInput = {
      target: "789",
      targetType: "facility",
      rangeStart: "2024-03-15T08:00:00+09:00",
      rangeEnd: "2024-03-15T20:00:00+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should use default targetType when not provided", () => {
    const validInput = {
      target: "123",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = schema.parse(validInput);
    expect(result.targetType).toBe("user");
  });

  it("should validate input with all optional parameters", () => {
    const validInput = {
      target: "123",
      targetType: "user",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
      showPrivate: false,
      limit: 50,
      offset: 10,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate different datetime formats", () => {
    const validInputs = [
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-07-15T14:30:00+09:00",
        rangeEnd: "2024-07-15T18:45:00+09:00",
      },
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-12-25T00:00:00+09:00",
        rangeEnd: "2024-12-25T23:59:59+09:00",
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should reject missing required fields", () => {
    const invalidInputs = [
      {},
      { target: "123" },
      { rangeStart: "2024-01-01T00:00:00+09:00" },
      { rangeEnd: "2024-01-07T23:59:59+09:00" },
      {
        target: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
      },
      {
        target: "123",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid target type", () => {
    const invalidInputs = [
      {
        target: 123,
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        target: "123",
        targetType: "invalid",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid optional parameter types", () => {
    const invalidInputs = [
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        showPrivate: "true",
      },
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        limit: "10",
      },
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        offset: "5",
      },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should accept optional parameters as undefined", () => {
    const validInputs = [
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        showPrivate: undefined,
      },
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        limit: undefined,
      },
      {
        target: "123",
        targetType: "user",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        offset: undefined,
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });
});
