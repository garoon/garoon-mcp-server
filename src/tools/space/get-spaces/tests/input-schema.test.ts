import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-get-spaces inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should accept empty input (all optional)", () => {
    expect(schema.parse({})).toEqual({});
  });

  it("should accept limit only", () => {
    expect(schema.parse({ limit: 50 })).toEqual({ limit: 50 });
  });

  it("should accept offset only", () => {
    expect(schema.parse({ offset: 10 })).toEqual({ offset: 10 });
  });

  it("should accept both limit and offset", () => {
    expect(schema.parse({ limit: 50, offset: 10 })).toEqual({
      limit: 50,
      offset: 10,
    });
  });
});
