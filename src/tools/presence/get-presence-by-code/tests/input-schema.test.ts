import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-presence-by-code inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require loginName", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept loginName", () => {
    expect(schema.parse({ loginName: "jiro_suzuki" })).toEqual({
      loginName: "jiro_suzuki",
    });
  });
});
