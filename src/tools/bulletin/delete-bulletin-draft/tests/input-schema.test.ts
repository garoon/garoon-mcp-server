import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("delete-bulletin-draft input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with topicId", () => {
    const validInput = {
      topicId: "1",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing required topicId", () => {
    const invalidInput = {};

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject non-string topicId", () => {
    const invalidInput = {
      topicId: 123,
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });
});
