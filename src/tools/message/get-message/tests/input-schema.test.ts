import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-message inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should accept valid messageId", () => {
    expect(schema.parse({ messageId: "100" })).toEqual({
      messageId: "100",
    });
  });

  it("should reject missing messageId", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should reject non-string messageId", () => {
    expect(() => schema.parse({ messageId: 100 })).toThrow();
  });
});
