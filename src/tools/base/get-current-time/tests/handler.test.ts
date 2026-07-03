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

    expect(result.timezone).toBe("Asia/Tokyo");
    expect(result.datetime).toBe("2024-07-27T11:00:00+09:00");
  });

  it("should use UTC as default timezone when not provided", async () => {
    const result = await getCurrentTimeHandler({});

    expect(result.timezone).toBe("UTC");
  });

  it("should return error for unsupported timezone", async () => {
    await expect(
      getCurrentTimeHandler({ timezone: "Invalid/Timezone" }),
    ).rejects.toThrow("Unsupported timezone: Invalid/Timezone");
  });

  it("should handle undefined timezone parameter", async () => {
    const result = await getCurrentTimeHandler({ timezone: undefined });

    expect(result.timezone).toBe("UTC");
  });

  it("should return structured content", async () => {
    const result = await getCurrentTimeHandler({ timezone: "Asia/Tokyo" });

    expect(result.timezone).toBe("Asia/Tokyo");
    expect(result.datetime).toBe("2024-07-27T11:00:00+09:00");
  });

  it("should handle different timezones correctly", async () => {
    const mockZonedDateTimeUTC = {
      toString: vi.fn().mockReturnValue("2024-07-27T02:00:00Z[UTC]"),
    };
    const mockInstantValueUTC = {
      toZonedDateTimeISO: vi.fn().mockReturnValue(mockZonedDateTimeUTC),
    };
    mockInstant.mockReturnValue(mockInstantValueUTC as any);

    const result = await getCurrentTimeHandler({ timezone: "UTC" });

    expect(result.timezone).toBe("UTC");
    expect(result.datetime).toBe("2024-07-27T02:00:00Z");
  });
});
