import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-presence-by-code outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate a valid response", () => {
    const validOutput = {
      result: {
        presence: {
          user: { id: "1", code: "jiro_suzuki", name: "Jiro Suzuki" },
          updatedAt: "2024-01-01T00:00:00+09:00",
          notes: "Working from home",
          status: { name: "Attending", code: "attend" },
        },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should allow empty notes", () => {
    const validOutput = {
      result: {
        presence: {
          user: { id: "1", code: "user1", name: "User 1" },
          updatedAt: "2024-01-01T00:00:00+09:00",
          notes: "",
          status: { name: "Absence", code: "absence" },
        },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
