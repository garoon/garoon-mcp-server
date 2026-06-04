import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-message outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate a complete valid response", () => {
    const validOutput = {
      result: {
        id: "100",
        title: "Test Message",
        acknowledgement: false,
        creator: { id: "1", code: "user1", name: "User One" },
        updater: { id: "1", code: "user1", name: "User One" },
        createdAt: "2024-07-27T11:00:00+09:00",
        updatedAt: null,
        recipients: [
          {
            id: "2",
            name: "User Two",
            code: "user2",
            type: "USER",
            isAcknowledged: false,
          },
        ],
        isDraft: false,
        body: "Hello",
        isHtmlBody: false,
        folders: [{ id: "1", name: "Inbox", type: "INBOX" }],
        operatorType: "ONLY_SENDER",
        operators: [],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate error output", () => {
    const validOutput = {
      error: "Some error message",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should accept empty object (both result and error are optional)", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
  });

  it("should validate response with updatedAt as string", () => {
    const validOutput = {
      result: {
        id: "200",
        title: "Updated Message",
        acknowledgement: true,
        creator: { id: "1", code: "admin", name: "Admin" },
        updater: { id: "2", code: "editor", name: "Editor" },
        createdAt: "2024-07-27T11:00:00+09:00",
        updatedAt: "2024-07-28T10:00:00+09:00",
        recipients: [],
        isDraft: false,
        body: "<p>Hello</p>",
        isHtmlBody: true,
        folders: [],
        operatorType: "ALL_TO_RECIPIENTS",
        operators: [
          { id: "3", name: "User Three", code: "user3", type: "USER" },
        ],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should reject invalid result structure", () => {
    const invalidOutput = {
      result: {
        id: 100,
        title: "Test",
      },
    };

    expect(() => schema.parse(invalidOutput)).toThrow();
  });
});
