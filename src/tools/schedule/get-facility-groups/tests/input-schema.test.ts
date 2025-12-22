import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-facility-groups inputSchema", () => {
  it("should accept empty input", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({})).toEqual({});
  });

  it("should accept limit and offset", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ limit: 30, offset: 10 })).toEqual({
      limit: 30,
      offset: 10,
    });
  });
});
