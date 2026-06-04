import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("update-bulletin-topic input schema", () => {
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
      subject: "Updated Topic",
      body: "Updated body",
      isHtmlBody: true,
      manuallySender: { id: "2" },
      allowComments: false,
      operatorType: "SELECT_USERS",
      operators: [{ id: "5" }],
      attachments: [{ name: "file.txt", content: "dGVzdA==" }],
      publicPeriod: { isUnlimited: true },
      isNotified: true,
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

  it("should accept operators with code instead of id", () => {
    const validInput = {
      topicId: "1",
      operators: [{ code: "admin" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });
});
