import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
import { getCurrentTimeTool as tool } from "./get-current-time.js";

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

describe("get-current-time tool", () => {
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

  describe("tool configuration", () => {
    it("should have correct name", () => {
      expect(tool.name).toBe("get-current-time");
    });

    it("should have correct description", () => {
      expect(tool.config.description).toBe(
        "Get the current datetime in RFC 3339 format.",
      );
    });

    it("should have correct title", () => {
      expect(tool.config.title).toBe("Get the current date and time.");
    });
  });

  describe("callback function", () => {
    it("should successfully get current time with timezone", async () => {
      const result = await tool.callback({ timezone: "Asia/Tokyo" }, {} as any);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");

      const parsedResult = JSON.parse(result.content[0].text as string);
      expect(parsedResult.isError).toBe(false);
      expect(parsedResult.result.timezone).toBe("Asia/Tokyo");
      expect(parsedResult.result.datetime).toBe("2024-07-27T11:00:00+09:00");
    });

    it("should use UTC as default timezone when not provided", async () => {
      const result = await tool.callback({}, {} as any);

      expect(result.content).toHaveLength(1);
      const parsedResult = JSON.parse(result.content[0].text as string);
      expect(parsedResult.result.timezone).toBe("UTC");
    });

    it("should return error for unsupported timezone", async () => {
      const result = await tool.callback(
        { timezone: "Invalid/Timezone" },
        {} as any,
      );

      expect(result.content).toHaveLength(1);
      const parsedResult = JSON.parse(result.content[0].text as string);
      expect(parsedResult.isError).toBe(true);
      expect(parsedResult.error).toBe("Unsupported timezone: Invalid/Timezone");
    });

    it("should handle undefined timezone parameter", async () => {
      const result = await tool.callback({ timezone: undefined }, {} as any);

      expect(result.content).toHaveLength(1);
      const parsedResult = JSON.parse(result.content[0].text as string);
      expect(parsedResult.result.timezone).toBe("UTC");
    });

    it("should return structured content", async () => {
      const result = await tool.callback({ timezone: "Asia/Tokyo" }, {} as any);

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
  });
});
