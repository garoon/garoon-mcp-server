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

    // Mock instant with a fixed datetime
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
    const result = await getCurrentTimeHandler(
      { timezone: "Asia/Tokyo" },
      {} as any,
    );

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.timezone).toBe("Asia/Tokyo");
    expect(parsedResult.result.datetime).toBe("2024-07-27T11:00:00+09:00");
  });

  it("should use UTC as default timezone when not provided", async () => {
    const result = await getCurrentTimeHandler({}, {} as any);

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.timezone).toBe("UTC");
  });

  it("should return error for unsupported timezone", async () => {
    await expect(
      getCurrentTimeHandler({ timezone: "Invalid/Timezone" }, {} as any),
    ).rejects.toThrow("Unsupported timezone: Invalid/Timezone");
  });

  it("should handle undefined timezone parameter", async () => {
    const result = await getCurrentTimeHandler(
      { timezone: undefined },
      {} as any,
    );

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.timezone).toBe("UTC");
  });

  it("should return structured content", async () => {
    const result = await getCurrentTimeHandler(
      { timezone: "Asia/Tokyo" },
      {} as any,
    );

    expect(result.structuredContent).toBeDefined();
    if (result.structuredContent) {
      expect((result.structuredContent.result as any).timezone).toBe(
        "Asia/Tokyo",
      );
      expect((result.structuredContent.result as any).datetime).toBe(
        "2024-07-27T11:00:00+09:00",
      );
    }
  });

  it("should handle different timezones correctly", async () => {
    const mockZonedDateTimeUTC = {
      toString: vi.fn().mockReturnValue("2024-07-27T02:00:00Z[UTC]"),
    };
    const mockInstantValueUTC = {
      toZonedDateTimeISO: vi.fn().mockReturnValue(mockZonedDateTimeUTC),
    };
    mockInstant.mockReturnValue(mockInstantValueUTC as any);

    const result = await getCurrentTimeHandler({ timezone: "UTC" }, {} as any);

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.timezone).toBe("UTC");
    expect(parsedResult.result.datetime).toBe("2024-07-27T02:00:00Z");
  });
});
