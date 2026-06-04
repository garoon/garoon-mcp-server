import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-create-space-discussion outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        id: "1",
        title: "Test Discussion",
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate response with all fields", () => {
    const validOutput = {
      result: {
        id: "1",
        title: "Test Discussion",
        body: "Discussion body",
        isHtmlBody: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
