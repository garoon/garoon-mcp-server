import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-create-message inputSchema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with required fields only", () => {
    const validInput = {
      title: "Test Message",
      recipients: [{ id: "1", type: "USER" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with all fields", () => {
    const validInput = {
      title: "Test Message",
      recipients: [
        { id: "1", type: "USER" },
        { id: "2", type: "USER" },
      ],
      acknowledgement: true,
      isDraft: false,
      body: "Hello, this is a test message.",
      isHtmlBody: false,
      operatorType: "SELECT_USERS",
      operators: [{ id: "1", code: "user1", type: "USER" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject missing required title field", () => {
    const invalidInput = {
      recipients: [{ id: "1", type: "USER" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject missing required recipients field", () => {
    const invalidInput = {
      title: "Test Message",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject title exceeding 100 characters", () => {
    const invalidInput = {
      title: "a".repeat(101),
      recipients: [{ id: "1", type: "USER" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should accept title with exactly 100 characters", () => {
    const validInput = {
      title: "a".repeat(100),
      recipients: [{ id: "1", type: "USER" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should reject invalid recipient type", () => {
    const invalidInput = {
      title: "Test",
      recipients: [{ id: "1", type: "ORGANIZATION" }],
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should reject invalid operatorType", () => {
    const invalidInput = {
      title: "Test",
      recipients: [{ id: "1", type: "USER" }],
      operatorType: "INVALID",
    };

    expect(() => schema.parse(invalidInput)).toThrow();
  });

  it("should apply default values for optional boolean fields", () => {
    const input = {
      title: "Test Message",
      recipients: [{ id: "1", type: "USER" }],
    };

    const parsed = schema.parse(input);
    expect(parsed.acknowledgement).toBe(false);
    expect(parsed.isDraft).toBe(false);
    expect(parsed.isHtmlBody).toBe(false);
  });

  it("should accept operators without code", () => {
    const validInput = {
      title: "Test",
      recipients: [{ id: "1", type: "USER" }],
      operators: [{ id: "2", type: "USER" }],
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });
});
