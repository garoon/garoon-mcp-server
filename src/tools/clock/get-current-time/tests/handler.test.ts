import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
import { getCurrentTimeHandler } from "../handler.js";

vi.mock("@js-temporal/polyfill", async () => {
  const actual = await vi.importActual("@js-temporal/polyfill");
  return {
    ...actual,
    Temporal: {
      Now: {
        instant: vi.fn(),
      },
    },
  };
});

describe("getCurrentTimeHandler", () => {
  const mockInstant = vi.mocked(Temporal.Now.instant);

  beforeEach(() => {
    vi.clearAllMocks();

    const mockZonedDateTime = {
      toString: vi
        .fn()
        .mockReturnValue("2024-07-27T11:00:00+09:00[Asia/Tokyo]"),
    };
    const mockInstantValue = {
      toZonedDateTimeISO: vi.fn().mockReturnValue(mockZonedDateTime),
    };
    mockInstant.mockReturnValue(mockInstantValue as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get current time with timezone", async () => {
    const result = await getCurrentTimeHandler({ timezone: "Asia/Tokyo" });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.isError).toBe(false);
    expect(parsedResult.result.timezone).toBe("Asia/Tokyo");
    expect(parsedResult.result.datetime).toBe("2024-07-27T11:00:00+09:00");
  });

  it("should use UTC as default timezone when not provided", async () => {
    const result = await getCurrentTimeHandler({});

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.timezone).toBe("UTC");
  });

  it("should use UTC as default timezone when undefined", async () => {
    const result = await getCurrentTimeHandler({ timezone: undefined });

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.timezone).toBe("UTC");
  });

  it("should throw error for unsupported timezone", async () => {
    await expect(
      getCurrentTimeHandler({ timezone: "Invalid/Timezone" }),
    ).rejects.toThrow("Unsupported timezone: Invalid/Timezone");
  });

  it("should handle different timezone formats", async () => {
    const timezones = [
      "UTC",
      "America/New_York",
      "Europe/London",
      "Australia/Sydney",
    ];

    for (const timezone of timezones) {
      const mockZonedDateTime = {
        toString: vi
          .fn()
          .mockReturnValue(`2024-07-27T11:00:00+09:00[${timezone}]`),
      };
      const mockInstantValue = {
        toZonedDateTimeISO: vi.fn().mockReturnValue(mockZonedDateTime),
      };
      mockInstant.mockReturnValue(mockInstantValue as any);

      const result = await getCurrentTimeHandler({ timezone });
      const parsedResult = JSON.parse(result.content[0].text as string);
      expect(parsedResult.result.timezone).toBe(timezone);
    }
  });

  it("should format datetime correctly", async () => {
    const mockZonedDateTime = {
      toString: vi
        .fn()
        .mockReturnValue("2024-07-27T11:00:00+09:00[Asia/Tokyo]"),
    };
    const mockInstantValue = {
      toZonedDateTimeISO: vi.fn().mockReturnValue(mockZonedDateTime),
    };
    mockInstant.mockReturnValue(mockInstantValue as any);

    const result = await getCurrentTimeHandler({ timezone: "Asia/Tokyo" });
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.datetime).toBe("2024-07-27T11:00:00+09:00");
  });

  it("should return structured content", async () => {
    const result = await getCurrentTimeHandler({ timezone: "Asia/Tokyo" });

    expect(result.structuredContent).toBeDefined();
    if (result.structuredContent) {
      expect(result.structuredContent.isError).toBe(false);
      expect((result.structuredContent.result as any).timezone).toBe(
        "Asia/Tokyo",
      );
      expect((result.structuredContent.result as any).datetime).toBe(
        "2024-07-27T11:00:00+09:00",
      );
    }
  });

  it("should validate output schema", async () => {
    const result = await getCurrentTimeHandler({ timezone: "Asia/Tokyo" });

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
  });

  it("should handle empty string timezone", async () => {
    const result = await getCurrentTimeHandler({ timezone: "" });

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.timezone).toBe("UTC");
  });

  it("should call Temporal.Now.instant()", async () => {
    await getCurrentTimeHandler({ timezone: "Asia/Tokyo" });

    expect(mockInstant).toHaveBeenCalledTimes(1);
  });

  it("should call toZonedDateTimeISO with correct timezone", async () => {
    const mockZonedDateTime = {
      toString: vi
        .fn()
        .mockReturnValue("2024-07-27T11:00:00+09:00[Asia/Tokyo]"),
    };
    const mockInstantValue = {
      toZonedDateTimeISO: vi.fn().mockReturnValue(mockZonedDateTime),
    };
    mockInstant.mockReturnValue(mockInstantValue as any);

    await getCurrentTimeHandler({ timezone: "Asia/Tokyo" });

    expect(mockInstantValue.toZonedDateTimeISO).toHaveBeenCalledWith(
      "Asia/Tokyo",
    );
  });
});
