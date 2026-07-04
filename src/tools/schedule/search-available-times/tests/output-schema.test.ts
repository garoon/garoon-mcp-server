import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("search-available-times output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with available times", () => {
    const validOutput = {
      result: {
        availableTimes: [
          {
            start: {
              dateTime: "2024-07-27T09:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T09:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            start: {
              dateTime: "2024-07-27T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T10:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate output with facility information", () => {
    const validOutput = {
      result: {
        availableTimes: [
          {
            start: {
              dateTime: "2024-07-27T09:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T09:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            facility: {
              id: "1",
              code: "f1",
              name: "f1",
            },
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty available times", () => {
    const validOutput = {
      result: {
        availableTimes: [],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should describe the error field but reject an error-only output", () => {
    // Error outputs are emitted with isError: true, which the MCP SDK excludes
    // from output-schema validation, so the public schema still requires result.
    expect(outputSchema.error.parse("Some error message")).toBe(
      "Some error message",
    );
    expect(() => schema.parse({ error: "Some error message" })).toThrow();
  });

  it("should reject invalid available times structure", () => {
    const invalidOutputs = [
      {
        result: {
          availableTimes: "invalid",
        },
      },
      {
        result: {
          availableTimes: [
            {
              start: "invalid",
              end: {
                dateTime: "2024-07-27T09:30:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
        },
      },
      {
        result: {
          availableTimes: [
            {
              start: {
                dateTime: "2024-07-27T09:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: "invalid",
            },
          ],
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should reject an empty object because result is required", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).toThrow();
  });

  it("should validate facility with all fields", () => {
    const validOutput = {
      result: {
        availableTimes: [
          {
            start: {
              dateTime: "2024-07-27T09:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T09:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            facility: {
              id: "1",
              code: "f1",
              name: "f1",
              description: "Facility 1",
              capacity: 10,
              location: "Building A",
            },
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate multiple time slots with mixed facility presence", () => {
    const validOutput = {
      result: {
        availableTimes: [
          {
            start: {
              dateTime: "2024-07-27T09:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T09:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            facility: {
              id: "1",
              code: "f1",
              name: "f1",
            },
          },
          {
            start: {
              dateTime: "2024-07-27T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T10:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
