import { describe, it, expect, vi } from "vitest";
import { getThisMonthsEvents } from "./get-this-months-events.js";

describe("getThisMonthsEvents", () => {
  it("should return messages with user name and default language", async () => {
    const result = await getThisMonthsEvents.callback(
      { name: "田中太郎" },
      {} as any,
    );

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("user");
    expect(result.messages[0].content.type).toBe("text");
    expect(result.messages[0].content.text).toContain("田中太郎");
    expect(result.messages[0].content.text).toContain("日本語");
  });

  it("should return messages with specified language", async () => {
    const result = await getThisMonthsEvents.callback(
      { name: "John Doe", lang: "English" },
      {} as any,
    );

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content.text).toContain("John Doe");
    expect(result.messages[0].content.text).toContain("English");
  });

  it("should have correct prompt configuration", () => {
    expect(getThisMonthsEvents.name).toBe("get-this-months-events");
    expect(getThisMonthsEvents.config.title).toBe("This month's event");
    expect(getThisMonthsEvents.config.description).toBe(
      "Get a user's schedule events for this month",
    );
    expect(getThisMonthsEvents.config.argsSchema).toBeDefined();
  });
});
