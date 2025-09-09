import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { searchScheduleEvents as tool } from "./get-schedule-events.js";
import { z } from "zod";
import * as client from "../../client.js";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual("../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("search-schedule-events tool", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("tool configuration", () => {
    it("should have correct name", () => {
      expect(tool.name).toBe("search-schedule-events");
    });

    it("should have correct description", () => {
      expect(tool.config.description).toBe(
        "Search for schedule events in a specified period",
      );
    });

    it("should have valid input schema", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const schema = z.object(tool.config.inputSchema!);

      const validInput = {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      expect(() => schema.parse(validInput)).not.toThrow();

      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ userId: 123 })).toThrow();
    });

    it("should have valid output schema", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const schema = z.object(tool.config.outputSchema!);

      const validOutput = {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              end: {
                dateTime: "2024-01-01T11:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              notes: "Test notes",
            },
          ],
          hasNext: false,
        },
      };
      expect(() => schema.parse(validOutput)).not.toThrow();

      expect(() => schema.parse({ error: "Some error" })).not.toThrow();

      expect(() =>
        schema.parse({
          result: { ...validOutput.result, events: "invalid" },
        }),
      ).toThrow();
    });
  });

  describe("callback function", () => {
    it("should successfully search schedule events", async () => {
      const mockApiResponse = {
        events: [
          {
            id: "123",
            subject: "Test Event",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T11:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            notes: "Test notes",
          },
        ],
        hasNext: false,
      };

      mockGetRequest.mockResolvedValue(mockApiResponse);

      const input = {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      };

      const result = await tool.callback(input, {} as any);

      const expectedParams = new URLSearchParams({
        fields: "id,subject,start,end,notes",
        rangeStart: input.rangeStart,
        rangeEnd: input.rangeEnd,
        target: input.userId,
        targetType: "user",
        limit: "100",
        orderBy: "updatedAt asc",
      });

      expect(mockGetRequest).toHaveBeenCalledWith(
        `/api/v1/schedule/events?${expectedParams.toString()}`,
      );

      expect(result).toHaveProperty("structuredContent");
      expect(result).toHaveProperty("content");
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.result).toEqual(mockApiResponse);
    });
  });
});
