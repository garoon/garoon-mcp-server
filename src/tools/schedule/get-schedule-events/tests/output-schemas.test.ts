import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-schedule-events output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with events", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            subject: "Test Event",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T11:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            notes: "Test notes",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty events list", () => {
    const validOutput = {
      result: {
        events: [],
        hasNext: false,
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

  it("should accept empty object (both result and error are optional)", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
  });

  it("should reject invalid events structure", () => {
    const invalidOutputs = [
      {
        result: {
          events: "invalid",
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: "invalid",
              end: {
                dateTime: "2024-01-01T11:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "Test notes",
            },
          ],
          hasNext: false,
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should validate multiple events", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            subject: "Event 1",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T11:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            notes: "Notes 1",
          },
          {
            id: "2",
            subject: "Event 2",
            start: {
              dateTime: "2024-01-02T14:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-02T15:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            notes: "Notes 2",
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
