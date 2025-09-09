import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { searchAvailableTimesHandler } from "../handler.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
  ServerRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import * as client from "../../../../client.js";

// Mock the client module
vi.mock("../../../../client.js", () => ({
  postRequest: vi.fn(),
}));

describe("searchAvailableTimesHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);
  const mockExtra = {} as RequestHandlerExtra<
    ServerRequest,
    ServerNotification
  >;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully search for available times with attendees", async () => {
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

    const result = await searchAvailableTimesHandler(input, mockExtra);

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
  });

  it("should handle facilities with OR condition", async () => {
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
          facility: {
            id: "1",
            code: "room1",
            name: "Room 1",
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
      facilities: [{ id: "1" }, { code: "room2" }],
      facilitySearchCondition: "OR" as const,
    };

    const result = await searchAvailableTimesHandler(input, mockExtra);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/searchAvailableTimes",
      JSON.stringify({
        timeRanges: input.timeRanges,
        timeInterval: input.timeInterval,
        facilities: [{ id: "1" }, { code: "room2" }],
        facilitySearchCondition: "OR",
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.availableTimes).toHaveLength(1);
  });

  it("should handle empty available times result", async () => {
    const mockApiResponse = {
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

    const result = await searchAvailableTimesHandler(input, mockExtra);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.availableTimes).toHaveLength(0);
  });

  it("should handle multiple time ranges", async () => {
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
      timeInterval: 30,
    };

    const result = await searchAvailableTimesHandler(input, mockExtra);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/searchAvailableTimes",
      JSON.stringify({
        timeRanges: input.timeRanges,
        timeInterval: input.timeInterval,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.availableTimes).toHaveLength(2);
  });

  it("should handle API errors gracefully", async () => {
    const error = new Error("API Error");
    mockPostRequest.mockRejectedValue(error);

    const input = {
      timeRanges: [
        {
          start: "2024-07-27T09:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 30,
    };

    await expect(searchAvailableTimesHandler(input, mockExtra)).rejects.toThrow(
      "API Error",
    );
  });
});
