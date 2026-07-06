import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-bulletin-topics outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        topics: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate topics with full data", () => {
    const validOutput = {
      result: {
        topics: [
          {
            id: "1",
            subject: "Important Notice",
            updatedAt: "2024-07-27T11:00:00+09:00",
            updater: {
              id: "10",
              code: "taro_yamada",
              name: "Taro Yamada",
            },
          },
          {
            id: "2",
            subject: "Meeting Notes",
            updatedAt: "2024-07-28T09:00:00+09:00",
            updater: {
              id: "20",
              code: "jiro_suzuki",
              name: "Jiro Suzuki",
            },
            manuallySender: "Admin",
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
