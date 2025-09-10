import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schemas.js";

describe("search-available-times input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with required fields only", () => {
    const validInput = {
      timeRanges: [
        {
          start: "2024-07-27T09:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 30,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with all fields", () => {
    const validInput = {
      timeRanges: [
        {
          start: "2024-07-27T09:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
        {
          start: "2024-07-28T09:00:00+09:00",
          end: "2024-07-28T18:00:00+09:00",
        },
      ],
      timeInterval: 60,
      attendees: [
        { type: "USER", id: "1" },
        { type: "USER", code: "user2" },
        { type: "ORGANIZATION", id: "3", code: "org3" },
      ],
      facilities: [{ id: "1" }, { code: "facility2" }],
      facilitySearchCondition: "OR",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate attendees with id or code", () => {
    const validInputs = [
      {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        attendees: [{ type: "USER", id: "1" }],
      },
      {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        attendees: [{ type: "USER", code: "user1" }],
      },
      {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        attendees: [{ type: "USER", id: "1", code: "user1" }],
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate facilities with id or code", () => {
    const validInputs = [
      {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        facilities: [{ id: "1" }],
      },
      {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        facilities: [{ code: "facility1" }],
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should reject empty timeRanges", () => {
    const invalidInput = {
      timeRanges: [],
      timeInterval: 30,
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject missing required fields", () => {
    const invalidInputs = [
      {},
      {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
      },
      { timeInterval: 30 },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject attendees without id or code", () => {
    const invalidInput = {
      timeRanges: [
        {
          start: "2024-07-27T09:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 30,
      attendees: [{ type: "USER" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject facilities without id or code", () => {
    const invalidInput = {
      timeRanges: [
        {
          start: "2024-07-27T09:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 30,
      facilities: [{}],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid attendee type", () => {
    const invalidInput = {
      timeRanges: [
        {
          start: "2024-07-27T09:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 30,
      attendees: [{ type: "INVALID", id: "1" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid facilitySearchCondition", () => {
    const invalidInput = {
      timeRanges: [
        {
          start: "2024-07-27T09:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 30,
      facilitySearchCondition: "INVALID",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });
});
