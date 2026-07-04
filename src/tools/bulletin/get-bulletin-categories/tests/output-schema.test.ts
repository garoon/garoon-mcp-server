import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-bulletin-categories outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        categories: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate categories with full data", () => {
    const validOutput = {
      result: {
        categories: [
          {
            id: "1",
            name: "General",
            description: "General announcements",
            hasSubCategories: true,
          },
          {
            id: "2",
            name: "HR",
            description: null,
            hasSubCategories: false,
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should describe the error field but reject an error-only output", () => {
    // Error outputs are emitted with isError: true, which the MCP SDK excludes
    // from output-schema validation, so the public schema still requires result.
    expect(outputSchema.error.parse("Something went wrong")).toBe(
      "Something went wrong",
    );
    expect(() => schema.parse({ error: "Something went wrong" })).toThrow();
  });
});
