import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-create-notification outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate a valid notification response", () => {
    const validOutput = {
      result: {
        moduleId: "grn.custom",
        notificationKey: "key-123",
        creator: {
          id: "1",
          code: "admin",
          name: "Administrator",
        },
        createdAt: "2024-01-01T00:00:00+09:00",
        operation: "add",
        url: "https://example.com",
        title: "Test Notification",
        body: "This is a test",
        icon: "https://example.com/icon.png",
        isRead: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate notification with modify operation", () => {
    const validOutput = {
      result: {
        moduleId: "grn.custom",
        notificationKey: "key-456",
        creator: {
          id: "2",
          code: "user1",
          name: "User One",
        },
        createdAt: "2024-06-15T10:30:00+09:00",
        operation: "modify",
        url: "https://example.com/item/1",
        title: "Updated Item",
        body: "Item has been updated",
        icon: "",
        isRead: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});
