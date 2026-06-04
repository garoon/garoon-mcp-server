import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-update-presence-by-id inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require userId", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept userId only", () => {
    expect(schema.parse({ userId: "1" })).toEqual({
      userId: "1",
    });
  });

  it("should accept userId with status and notes", () => {
    expect(
      schema.parse({
        userId: "1",
        status: { code: "attend" },
        notes: "In a meeting",
      }),
    ).toEqual({
      userId: "1",
      status: { code: "attend" },
      notes: "In a meeting",
    });
  });

  it("should accept userId with status only", () => {
    expect(
      schema.parse({
        userId: "1",
        status: { code: "absence" },
      }),
    ).toEqual({
      userId: "1",
      status: { code: "absence" },
    });
  });

  it("should accept userId with notes only", () => {
    expect(
      schema.parse({
        userId: "1",
        notes: "Working remotely",
      }),
    ).toEqual({
      userId: "1",
      notes: "Working remotely",
    });
  });
});
