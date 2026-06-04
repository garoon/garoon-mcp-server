import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-todo-categories outputSchema", () => {
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

  it("should validate response with categories", () => {
    const validOutput = {
      result: {
        categories: [
          { id: 1, name: "Work" },
          { id: 2, name: "Personal" },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
