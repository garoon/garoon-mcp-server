import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-workflow-request inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require requestId", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept requestId", () => {
    expect(schema.parse({ requestId: "123" })).toEqual({
      requestId: "123",
    });
  });

  it("should reject non-string requestId", () => {
    expect(() => schema.parse({ requestId: 123 })).toThrow();
  });
});
