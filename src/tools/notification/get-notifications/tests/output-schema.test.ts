import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-notifications outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        items: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate response with notification items", () => {
    const validOutput = {
      result: {
        items: [
          {
            moduleId: "grn.schedule",
            creator: {
              id: "1",
              code: "admin",
              name: "Administrator",
            },
            createdAt: "2024-01-01T00:00:00+09:00",
            operation: "add",
            url: "https://example.com/schedule/1",
            title: "New Schedule Event",
            body: "A new event has been created",
            icon: "https://example.com/icon.png",
            isRead: false,
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
