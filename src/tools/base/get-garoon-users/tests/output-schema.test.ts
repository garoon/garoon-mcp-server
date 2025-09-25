import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-garoon-users output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with users and hasNext", () => {
    const validOutput = {
      users: [
        {
          id: "123",
          name: "John Doe",
          code: "john.doe",
          email: "john@example.com",
          url: "https://example.com/users/123",
        },
      ],
      hasNext: false,
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty users list with hasNext", () => {
    const validOutput = {
      users: [],
      hasNext: false,
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate multiple users with hasNext", () => {
    const validOutput = {
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
      hasNext: true,
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
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
              code: 123,
            },
          ],
        },
      },
      {
        result: {
          users: [
            {
              id: "123",
            },
          ],
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should validate users with all optional fields and hasNext", () => {
    const validOutput = {
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
      hasNext: false,
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate hasNext true scenario", () => {
    const validOutput = {
      users: [
        {
          id: "123",
          name: "John Doe",
          code: "john.doe",
        },
      ],
      hasNext: true,
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
