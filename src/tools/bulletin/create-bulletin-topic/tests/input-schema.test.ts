import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("create-bulletin-topic input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with required fields only", () => {
    const validInput = {
      categoryId: "10",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with all fields", () => {
    const validInput = {
      categoryId: "10",
      subject: "Test Topic",
      body: "Hello World",
      isHtmlBody: false,
      manuallySender: { id: "1" },
      acknowledgement: true,
      allowComments: true,
      operatorType: "SELECT_USERS",
      operators: [{ id: "5" }],
      attachments: [{ name: "file.txt", content: "dGVzdA==" }],
      publicPeriod: {
        isUnlimited: false,
        start: "2024-01-01T00:00:00Z",
        end: "2024-12-31T23:59:59Z",
      },
      isDraft: false,
      mentions: [{ id: "3", type: "USER" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing required categoryId", () => {
    const invalidInput = {};

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid operatorType", () => {
    const invalidInput = {
      categoryId: "10",
      operatorType: "INVALID",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid mention type", () => {
    const invalidInput = {
      categoryId: "10",
      mentions: [{ id: "1", type: "INVALID" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should accept operators with code instead of id", () => {
    const validInput = {
      categoryId: "10",
      operators: [{ code: "admin" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should default isHtmlBody to false", () => {
    const input = {
      categoryId: "10",
    };

    const parsed = schema.parse(input);
    expect(parsed.isHtmlBody).toBe(false);
  });

  it("should default isDraft to false", () => {
    const input = {
      categoryId: "10",
    };

    const parsed = schema.parse(input);
    expect(parsed.isDraft).toBe(false);
  });
});
