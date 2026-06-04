import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-spaces outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        spaces: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate response with spaces", () => {
    const validOutput = {
      result: {
        spaces: [
          {
            id: "1",
            name: "Test Space",
            isPublic: true,
            category: { id: "10", name: "General" },
            creator: { id: "100", code: "admin", name: "Admin User" },
            updater: { id: "100", code: "admin", name: "Admin User" },
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
