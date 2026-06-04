import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-create-message outputSchema", () => {
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
        folders: [{ id: "1", name: "Sent", type: "SENT" }],
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

  it("should validate a create response without updater, updatedAt, folders, operatorType, operators", () => {
    const validOutput = {
      result: {
        id: "100",
        title: "Test Message",
        acknowledgement: true,
        creator: { id: "1", code: "user1", name: "User One" },
        createdAt: "2024-07-27T11:00:00+09:00",
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

  it("should validate response with multiple recipients and operators", () => {
    const validOutput = {
      result: {
        id: "200",
        title: "Team Message",
        acknowledgement: true,
        creator: { id: "1", code: "admin", name: "Admin" },
        updater: { id: "1", code: "admin", name: "Admin" },
        createdAt: "2024-07-27T11:00:00+09:00",
        updatedAt: "2024-07-28T10:00:00+09:00",
        recipients: [
          {
            id: "2",
            name: "User Two",
            code: "user2",
            type: "USER",
            isAcknowledged: true,
          },
          {
            id: "3",
            name: "User Three",
            code: "user3",
            type: "USER",
            isAcknowledged: false,
          },
        ],
        isDraft: false,
        body: "<p>Hello</p>",
        isHtmlBody: true,
        folders: [],
        operatorType: "SELECT_USERS",
        operators: [{ id: "2", name: "User Two", code: "user2", type: "USER" }],
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
