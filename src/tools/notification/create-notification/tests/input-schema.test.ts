import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-create-notification inputSchema", () => {
  it("should accept valid input with all required fields", () => {
    const schema = z.object(inputSchema);
    const result = schema.parse({
      app: "myApp",
      notificationKey: "key-123",
      operation: "add",
      url: "https://example.com",
      title: "Test Notification",
      body: "This is a test notification",
      destinations: [{ type: "USER", id: 1 }],
    });
    expect(result.app).toBe("myApp");
    expect(result.operation).toBe("add");
    expect(result.destinations).toHaveLength(1);
  });

  it("should accept input with icon", () => {
    const schema = z.object(inputSchema);
    const result = schema.parse({
      app: "myApp",
      notificationKey: "key-123",
      operation: "modify",
      url: "https://example.com",
      title: "Test",
      body: "Body",
      icon: "https://example.com/icon.png",
      destinations: [{ type: "USER", code: "user1" }],
    });
    expect(result.icon).toBe("https://example.com/icon.png");
  });

  it("should accept all operation types", () => {
    const schema = z.object(inputSchema);
    for (const operation of ["add", "modify", "remove"] as const) {
      const result = schema.parse({
        app: "myApp",
        notificationKey: "key-123",
        operation,
        url: "https://example.com",
        title: "Test",
        body: "Body",
        destinations: [{ type: "USER", id: 1 }],
      });
      expect(result.operation).toBe(operation);
    }
  });

  it("should reject invalid operation type", () => {
    const schema = z.object(inputSchema);
    expect(() =>
      schema.parse({
        app: "myApp",
        notificationKey: "key-123",
        operation: "invalid",
        url: "https://example.com",
        title: "Test",
        body: "Body",
        destinations: [{ type: "USER", id: 1 }],
      }),
    ).toThrow();
  });

  it("should reject missing required fields", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({})).toThrow();
  });
});
