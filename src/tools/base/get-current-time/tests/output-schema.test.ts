import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-current-time output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with timezone and datetime", () => {
    const validOutput = {
      result: {
        timezone: "Asia/Tokyo",
        datetime: "2024-07-27T11:00:00+09:00",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate valid output with UTC timezone", () => {
    const validOutput = {
      result: {
        timezone: "UTC",
        datetime: "2024-07-27T02:00:00Z",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate error output", () => {
    const validOutput = {
      error: "Unsupported timezone: Invalid/Timezone",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should accept empty object (both result and error are optional)", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
  });

  it("should reject invalid result structure", () => {
    const invalidOutputs = [
      {
        result: {
          timezone: "Asia/Tokyo",
          datetime: 123,
        },
      },
      {
        result: {
          timezone: 123,
          datetime: "2024-07-27T11:00:00+09:00",
        },
      },
      {
        result: {
          timezone: "Asia/Tokyo",
        },
      },
      {
        result: {
          datetime: "2024-07-27T11:00:00+09:00",
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should validate various datetime formats", () => {
    const validOutputs = [
      {
        result: {
          timezone: "UTC",
          datetime: "2024-07-27T02:00:00Z",
        },
      },
      {
        result: {
          timezone: "Asia/Tokyo",
          datetime: "2024-07-27T11:00:00+09:00",
        },
      },
      {
        result: {
          timezone: "America/New_York",
          datetime: "2024-07-26T22:00:00-04:00",
        },
      },
    ];

    validOutputs.forEach((output) => {
      expect(() => schema.parse(output)).not.toThrow();
    });
  });
});
