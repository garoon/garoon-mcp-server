import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-bulletin-topic inputSchema", () => {
  it("should require topicId", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept topicId", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ topicId: "123" })).toEqual({ topicId: "123" });
  });
});
