import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-todo inputSchema", () => {
  it("should accept a valid todoId", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ todoId: "123" })).toEqual({ todoId: "123" });
  });

  it("should reject missing todoId", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({})).toThrow();
  });
});
