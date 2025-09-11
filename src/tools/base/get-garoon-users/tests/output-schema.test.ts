import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-garoon-users output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with users", () => {
    const validOutput = {
      result: {
        users: [
          {
            id: "123",
            name: "John Doe",
            code: "john.doe",
            email: "john@example.com",
            url: "https://example.com/users/123",
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty users list", () => {
    const validOutput = {
      result: {
        users: [],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate multiple users", () => {
    const validOutput = {
      result: {
        users: [
          {
            id: "123",
            name: "John Doe",
            code: "john.doe",
            email: "john@example.com",
            url: "https://example.com/users/123",
          },
          {
            id: "456",
            name: "Jane Smith",
            code: "jane.smith",
            email: "jane@example.com",
            url: "https://example.com/users/456",
          },
        ],
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

  it("should reject invalid users structure", () => {
    const invalidOutputs = [
      {
        result: {
          users: "invalid",
        },
      },
      {
        result: {
          users: [
            {
              id: "123",
              name: "John Doe",
              code: 123, // Invalid type
            },
          ],
        },
      },
      {
        result: {
          users: [
            {
              id: "123",
              // Missing required fields
            },
          ],
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should validate users with all optional fields", () => {
    const validOutput = {
      result: {
        users: [
          {
            id: "123",
            name: "John Doe",
            code: "john.doe",
            email: "john@example.com",
            url: "https://example.com/users/123",
            description: "Software Engineer",
            phone: "+1-555-123-4567",
            mobile: "+1-555-987-6543",
            timezone: "America/New_York",
            isEnabled: true,
            isGuest: false,
            sortOrder: 1,
          },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
