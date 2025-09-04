import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { searchAvailableTimes as tool } from "./search-available-times.js";
import { z } from "zod";
import * as client from "../../client.js";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual("../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("search-available-times tool", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("tool configuration", () => {
    it("should have correct name", () => {
      expect(tool.name).toBe("search-available-times");
    });

    it("should have correct description", () => {
      expect(tool.config.description).toBe(
        "Search for available time slots for specified attendees within given time ranges",
      );
    });

    it("should have valid input schema", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const schema = z.object(tool.config.inputSchema!);

      const validInput = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
          {
            start: "2024-07-28T09:00:00+09:00",
            end: "2024-07-28T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        attendees: [
          { type: "USER", id: "1" },
          { type: "USER", code: "user2" },
          { type: "ORGANIZATION", id: "3", code: "org3" },
        ],
      };

      expect(() => schema.parse(validInput)).not.toThrow();

      // Test invalid inputs
      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ timeRanges: [] })).toThrow();
      expect(() =>
        schema.parse({ timeRanges: validInput.timeRanges }),
      ).toThrow();
      expect(() =>
        schema.parse({
          timeRanges: validInput.timeRanges,
          timeInterval: validInput.timeInterval,
        }),
      ).toThrow();
    });

    it("should have valid output schema", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const schema = z.object(tool.config.outputSchema!);

      const validOutput = {
        isError: false,
        result: {
          availableTimes: [
            {
              start: "2024-07-27T09:00:00+09:00",
              end: "2024-07-27T09:30:00+09:00",
            },
            {
              start: "2024-07-27T10:00:00+09:00",
              end: "2024-07-27T10:30:00+09:00",
            },
            {
              start: "2024-07-27T14:00:00+09:00",
              end: "2024-07-27T14:30:00+09:00",
            },
          ],
        },
      };

      expect(() => schema.parse(validOutput)).not.toThrow();

      // Test invalid outputs
      expect(() => schema.parse({ result: validOutput.result })).toThrow();
      expect(() =>
        schema.parse({
          isError: validOutput.isError,
          result: { ...validOutput.result, availableTimes: "invalid" },
        }),
      ).toThrow();
    });
  });

  describe("callback function", () => {
    it("should successfully search for available times", async () => {
      const mockApiResponse = {
        availableTimes: [
          {
            start: {
              dateTime: "2024-07-27T09:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T09:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            start: {
              dateTime: "2024-07-27T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T10:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            start: {
              dateTime: "2024-07-27T14:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T14:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
      };

      mockPostRequest.mockResolvedValue(mockApiResponse);

      const input = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        attendees: [
          { type: "USER" as const, id: "1" },
          { type: "USER" as const, code: "user2" },
        ],
      };

      const result = await tool.callback(input, {} as any);

      expect(mockPostRequest).toHaveBeenCalledWith(
        "/api/v1/schedule/searchAvailableTimes",
        JSON.stringify({
          timeRanges: input.timeRanges,
          timeInterval: input.timeInterval,
          attendees: [
            { type: "USER", id: "1" },
            { type: "USER", code: "user2" },
          ],
        }),
      );

      expect(result).toHaveProperty("structuredContent");
      expect(result).toHaveProperty("content");
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.isError).toBe(false);
      expect(structuredContent.result.availableTimes).toHaveLength(3);
      expect(structuredContent.result.availableTimes[0]).toEqual({
        start: "2024-07-27T09:00:00+09:00",
        end: "2024-07-27T09:30:00+09:00",
      });
    });

    it("should handle multiple time ranges and attendees", async () => {
      const mockApiResponse = {
        attendees: [
          {
            type: "USER",
            id: "1",
            code: "user1",
            name: "User 1",
          },
          {
            type: "ORGANIZATION",
            id: "2",
            code: "org2",
            name: "Organization 2",
          },
          {
            type: "USER",
            id: "3",
            code: "user3",
            name: "User 3",
          },
        ],
        availableTimes: [
          {
            start: {
              dateTime: "2024-07-27T09:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-27T09:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            start: {
              dateTime: "2024-07-28T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-07-28T10:30:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
      };

      mockPostRequest.mockResolvedValue(mockApiResponse);

      const input = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
          {
            start: "2024-07-28T09:00:00+09:00",
            end: "2024-07-28T18:00:00+09:00",
          },
        ],
        timeInterval: 60,
        attendees: [
          { type: "USER" as const, id: "1" },
          { type: "ORGANIZATION" as const, id: "2" },
          { type: "USER" as const, code: "user3" },
        ],
      };

      const result = await tool.callback(input, {} as any);

      expect(mockPostRequest).toHaveBeenCalledWith(
        "/api/v1/schedule/searchAvailableTimes",
        JSON.stringify({
          timeRanges: input.timeRanges,
          timeInterval: input.timeInterval,
          attendees: [
            { type: "USER", id: "1" },
            { type: "ORGANIZATION", id: "2" },
            { type: "USER", code: "user3" },
          ],
        }),
      );

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.isError).toBe(false);
      expect(structuredContent.result.availableTimes).toHaveLength(2);
      expect(structuredContent.result.availableTimes[0]).toEqual({
        start: "2024-07-27T09:00:00+09:00",
        end: "2024-07-27T09:30:00+09:00",
      });
    });

    it("should handle empty available times result", async () => {
      const mockApiResponse = {
        attendees: [
          {
            type: "USER",
            id: "1",
            code: "user1",
            name: "User 1",
          },
        ],
        availableTimes: [],
      };

      mockPostRequest.mockResolvedValue(mockApiResponse);

      const input = {
        timeRanges: [
          {
            start: "2024-07-27T09:00:00+09:00",
            end: "2024-07-27T18:00:00+09:00",
          },
        ],
        timeInterval: 30,
        attendees: [{ type: "USER" as const, id: "1" }],
      };

      const result = await tool.callback(input, {} as any);

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.isError).toBe(false);
      expect(structuredContent.result.availableTimes).toHaveLength(0);
    });
  });
});
