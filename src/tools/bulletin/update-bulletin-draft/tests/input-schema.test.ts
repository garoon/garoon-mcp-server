import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("update-bulletin-draft input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with required fields only", () => {
    const validInput = {
      topicId: "1",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with all fields", () => {
    const validInput = {
      topicId: "1",
      subject: "Updated Draft",
      body: "Updated body",
      isHtmlBody: true,
      manuallySender: { id: "2" },
      allowComments: false,
      operatorType: "SELECT_USERS",
      operators: [{ id: "5" }],
      attachments: [{ name: "file.txt", content: "dGVzdA==" }],
      publicPeriod: { isUnlimited: true },
      isDraft: true,
      isNotified: false,
      mentions: [{ id: "3", type: "USER" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing required topicId", () => {
    const invalidInput = {};

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid operatorType", () => {
    const invalidInput = {
      topicId: "1",
      operatorType: "INVALID",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid mention type", () => {
    const invalidInput = {
      topicId: "1",
      mentions: [{ id: "1", type: "INVALID" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should default isDraft to true", () => {
    const input = {
      topicId: "1",
    };

    const parsed = schema.parse(input);
    expect(parsed.isDraft).toBe(true);
  });

  it("should allow isDraft to be set to false", () => {
    const input = {
      topicId: "1",
      isDraft: false,
    };

    const parsed = schema.parse(input);
    expect(parsed.isDraft).toBe(false);
  });
});
