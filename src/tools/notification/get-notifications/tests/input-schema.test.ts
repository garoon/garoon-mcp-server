import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-notifications inputSchema", () => {
  it("should accept empty input", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({})).toEqual({});
  });

  it("should accept all parameters", () => {
    const schema = z.object(inputSchema);
    expect(
      schema.parse({ fields: "title,body", limit: 50, offset: 10 }),
    ).toEqual({
      fields: "title,body",
      limit: 50,
      offset: 10,
    });
  });

  it("should accept only fields parameter", () => {
    const schema = z.object(inputSchema);
    expect(schema.parse({ fields: "title" })).toEqual({
      fields: "title",
    });
  });
});
