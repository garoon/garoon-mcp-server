import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
import { getCurrentTimeResource as resource } from "./get-current-time.js";

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

describe("get-current-time resource", () => {
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

  describe("resource configuration", () => {
    it("should have correct name", () => {
      expect(resource.name).toBe("get-current-time");
    });

    it("should have correct description", () => {
      expect(resource.config.description).toContain(
        "Get the current datetime in RFC 3339",
      );
    });

    it("should have correct mimeType", () => {
      expect(resource.config.mimeType).toBe("application/json");
    });
  });

  describe("callback function", () => {
    it("should successfully get current time with timezone", async () => {
      const uri = new URL("clock://get-current-time/Asia/Tokyo");
      const result = await resource.callback(
        uri,
        { timezone: "Asia/Tokyo" },
        {} as any,
      );

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe(uri.href);
      expect(result.contents[0].mimeType).toBe("application/json");

      const parsedResult = JSON.parse(result.contents[0].text as string);
      expect(parsedResult.isError).toBe(false);
      expect(parsedResult.result.timezone).toBe("Asia/Tokyo");
      expect(parsedResult.result.datetime).toBe("2024-07-27T11:00:00+09:00");
    });

    it("should handle array timezone parameter", async () => {
      const uri = new URL("clock://get-current-time/UTC");
      const result = await resource.callback(
        uri,
        { timezone: ["Europe/London", "Asia/Tokyo"] },
        {} as any,
      );

      expect(result.contents).toHaveLength(1);
      const parsedResult = JSON.parse(result.contents[0].text as string);
      console.log(parsedResult);
      expect(parsedResult.result.timezone).toBe("Europe/London");
    });

    it("should throw error for unsupported timezone", async () => {
      const uri = new URL("clock://get-current-time/Invalid/Timezone");
      const result = await resource.callback(
        uri,
        { timezone: "Invalid/Timezone" },
        {} as any,
      );

      expect(result.contents).toHaveLength(1);
      const parsedResult = JSON.parse(result.contents[0].text as string);
      expect(parsedResult.isError).toBe(true);
      expect(parsedResult.error).toBe("Unsupported timezone: Invalid/Timezone");
    });
  });
});
