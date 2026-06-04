import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-todo outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate a valid TODO response", () => {
    const validOutput = {
      result: {
        id: 1,
        status: "Uncompleted",
        category: 10,
        subject: "Test TODO",
        hasDueDate: true,
        dueDate: "2024-12-31T23:59:59+09:00",
        priority: 2,
        notes: "Some notes",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate a TODO without optional dueDate", () => {
    const validOutput = {
      result: {
        id: 2,
        status: "Completed",
        category: 5,
        subject: "Another TODO",
        hasDueDate: false,
        priority: 1,
        notes: "",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
