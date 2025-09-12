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

  it("should validate error output", () => {
    const validOutput = {
      error: "Some error message",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
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

  it("should accept empty object (both result and error are optional)", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
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
