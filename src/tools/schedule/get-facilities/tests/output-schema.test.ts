import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-facilities output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with facilities", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "123",
            code: "101",
            name: "Conference Room 1",
            notes: "Large conference room with projector",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty facilities list", () => {
    const validOutput = {
      result: {
        facilities: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate multiple facilities", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "123",
            code: "101",
            name: "Conference Room 1",
            notes: "Large conference room with projector",
          },
          {
            id: "456",
            code: "102",
            name: "Meeting Room 2",
            notes: "Small meeting room for 4 people",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate facilities without notes", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "123",
            code: "101",
            name: "Conference Room 1",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate facilities with hasNext true", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "123",
            code: "101",
            name: "Conference Room 1",
          },
        ],
        hasNext: true,
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

  it("should reject invalid facilities structure", () => {
    const invalidOutputs = [
      {
        result: {
          facilities: "invalid",
          hasNext: false,
        },
      },
      {
        result: {
          facilities: [
            {
              id: "123",
              code: 123, // Invalid type
              name: "Conference Room 1",
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          facilities: [
            {
              id: "123",
              // Missing required fields
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

  it("should reject invalid hasNext type", () => {
    const invalidOutputs = [
      {
        result: {
          facilities: [],
          hasNext: "true",
        },
      },
      {
        result: {
          facilities: [],
          hasNext: 1,
        },
      },
      {
        result: {
          facilities: [],
          hasNext: {},
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should validate facilities with Japanese names", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "789",
            code: "201",
            name: "会議室A",
            notes: "大型会議室",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate facilities with special characters in names", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "101",
            code: "301",
            name: "Room-101 & Room-102",
            notes: "Combined rooms with divider",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate facilities with numeric codes", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "202",
            code: "12345",
            name: "Training Room",
            notes: "Room for training sessions",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate facilities with empty notes", () => {
    const validOutput = {
      result: {
        facilities: [
          {
            id: "303",
            code: "401",
            name: "Small Meeting Room",
            notes: "",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate large number of facilities", () => {
    const facilities = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      code: (i + 1).toString(),
      name: `Room ${i + 1}`,
      notes: `Description for room ${i + 1}`,
    }));

    const validOutput = {
      result: {
        facilities,
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
