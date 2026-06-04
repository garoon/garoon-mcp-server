import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-update-presence-by-code inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should require loginName", () => {
    expect(() => schema.parse({})).toThrow();
  });

  it("should accept loginName only", () => {
    expect(schema.parse({ loginName: "jiro_suzuki" })).toEqual({
      loginName: "jiro_suzuki",
    });
  });

  it("should accept loginName with status and notes", () => {
    expect(
      schema.parse({
        loginName: "jiro_suzuki",
        status: { code: "attend" },
        notes: "In a meeting",
      }),
    ).toEqual({
      loginName: "jiro_suzuki",
      status: { code: "attend" },
      notes: "In a meeting",
    });
  });

  it("should accept loginName with status only", () => {
    expect(
      schema.parse({
        loginName: "jiro_suzuki",
        status: { code: "absence" },
      }),
    ).toEqual({
      loginName: "jiro_suzuki",
      status: { code: "absence" },
    });
  });

  it("should accept loginName with notes only", () => {
    expect(
      schema.parse({
        loginName: "jiro_suzuki",
        notes: "Working remotely",
      }),
    ).toEqual({
      loginName: "jiro_suzuki",
      notes: "Working remotely",
    });
  });
});
