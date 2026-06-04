import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-bulletin-topic outputSchema", () => {
  const schema = z.object(outputSchema);

  const minimalTopic = {
    id: "1",
    subject: "Test Topic",
    body: "Hello world",
    isHtmlBody: false,
    creator: { id: "10", code: "taro", name: "Taro" },
    updater: { id: "10", code: "taro", name: "Taro" },
    createdAt: "2024-07-27T11:00:00+09:00",
    updatedAt: "2024-07-27T11:00:00+09:00",
    acknowledgement: false,
    allowComments: true,
    operatorType: "ONLY_SENDER" as const,
    operators: [],
    attachments: [],
    publicPeriod: { isUnlimited: true },
    isDraft: false,
    isPublished: true,
    isExpired: false,
    category: { id: "5", name: "General" },
  };

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        topic: minimalTopic,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate topic with optional fields", () => {
    const validOutput = {
      result: {
        topic: {
          ...minimalTopic,
          manuallySender: "Admin",
          operators: [{ id: "20", code: "jiro", name: "Jiro" }],
          attachments: [
            {
              id: "100",
              name: "report.pdf",
              contentType: "application/pdf",
              size: "1024",
            },
          ],
          publicPeriod: {
            isUnlimited: false,
            start: "2024-07-01T00:00:00+09:00",
            end: "2024-12-31T23:59:59+09:00",
          },
        },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate error response", () => {
    const errorOutput = {
      error: "Topic not found",
    };

    expect(() => schema.parse(errorOutput)).not.toThrow();
  });
});
