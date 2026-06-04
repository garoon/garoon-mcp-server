import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("garoon-create-todo inputSchema", () => {
  it("should accept minimal input with only subject", () => {
    const schema = z.object(inputSchema);
    const result = schema.parse({ subject: "Test TODO" });
    expect(result.subject).toBe("Test TODO");
    expect(result.priority).toBe(2);
  });

  it("should accept all fields", () => {
    const schema = z.object(inputSchema);
    const result = schema.parse({
      subject: "Test TODO",
      category: 10,
      dueDate: "2024-12-31T23:59:59+09:00",
      priority: 1,
      notes: "Some notes",
    });
    expect(result).toEqual({
      subject: "Test TODO",
      category: 10,
      dueDate: "2024-12-31T23:59:59+09:00",
      priority: 1,
      notes: "Some notes",
    });
  });

  it("should reject subject longer than 100 characters", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({ subject: "a".repeat(101) })).toThrow();
  });

  it("should reject priority outside 1-3 range", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({ subject: "Test", priority: 0 })).toThrow();
    expect(() => schema.parse({ subject: "Test", priority: 4 })).toThrow();
  });

  it("should reject missing subject", () => {
    const schema = z.object(inputSchema);
    expect(() => schema.parse({})).toThrow();
  });
});
