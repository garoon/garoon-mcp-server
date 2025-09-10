import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { searchAvailableTimesHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("searchAvailableTimesHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
      facilities: [{ id: "1" }, { id: "2" }],
      facilitySearchCondition: "OR" as const,
    };

    const result = await searchAvailableTimesHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/searchAvailableTimes",
      JSON.stringify({
        timeRanges: input.timeRanges,
        timeInterval: input.timeInterval,
        attendees: [
          { type: "USER", id: "1" },
          { type: "USER", code: "user2" },
        ],
        facilities: [{ id: "1" }, { id: "2" }],
        facilitySearchCondition: "OR",
      }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.availableTimes).toHaveLength(2);
    expect(structuredContent.result.availableTimes[0]).toEqual({
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T09:30:00+09:00",
        timeZone: "Asia/Tokyo",
      },
    });
  });

  it("should handle multiple time ranges and attendees", async () => {
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
      timeInterval: 60,
      attendees: [
        { type: "USER" as const, id: "1" },
        { type: "ORGANIZATION" as const, id: "2" },
        { type: "USER" as const, code: "user3" },
      ],
      facilities: [{ id: "1" }, { id: "2" }],
      facilitySearchCondition: "AND" as const,
    };

    const result = await searchAvailableTimesHandler(input, {} as any);

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
        facilities: [{ id: "1" }, { id: "2" }],
        facilitySearchCondition: "AND",
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.availableTimes).toHaveLength(2);
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

    const result = await searchAvailableTimesHandler(input, {} as any);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.availableTimes).toHaveLength(0);
  });

  it("should handle OR condition with facility information", async () => {
    const mockApiResponse = {
      availableTimes: [
        {
          start: {
            dateTime: "2024-07-27T12:30:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T14:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          facility: {
            id: "1",
            code: "f1",
            name: "f1",
          },
        },
        {
          start: {
            dateTime: "2024-07-27T16:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T17:30:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          facility: {
            id: "1",
            code: "f1",
            name: "f1",
          },
        },
      ],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      timeRanges: [
        {
          start: "2024-07-27T12:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 90,
      attendees: [{ type: "USER" as const, code: "Administrator" }],
      facilities: [{ id: "1" }, { id: "2" }],
      facilitySearchCondition: "OR" as const,
    };

    const result = await searchAvailableTimesHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/searchAvailableTimes",
      JSON.stringify({
        timeRanges: input.timeRanges,
        timeInterval: input.timeInterval,
        attendees: [{ type: "USER", code: "Administrator" }],
        facilities: [{ id: "1" }, { id: "2" }],
        facilitySearchCondition: "OR",
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.availableTimes).toHaveLength(2);

    expect(structuredContent.result.availableTimes[0].facility).toEqual({
      id: "1",
      code: "f1",
      name: "f1",
    });
  });

  it("should handle AND condition without facility information", async () => {
    const mockApiResponse = {
      availableTimes: [
        {
          start: {
            dateTime: "2024-07-27T12:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T13:30:00+09:00",
            timeZone: "Asia/Tokyo",
          },
        },
        {
          start: {
            dateTime: "2024-07-27T13:30:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T15:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
        },
      ],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      timeRanges: [
        {
          start: "2024-07-27T12:00:00+09:00",
          end: "2024-07-27T18:00:00+09:00",
        },
      ],
      timeInterval: 90,
      attendees: [{ type: "USER" as const, code: "Administrator" }],
      facilities: [{ id: "1" }, { id: "2" }],
      facilitySearchCondition: "AND" as const,
    };

    const result = await searchAvailableTimesHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/searchAvailableTimes",
      JSON.stringify({
        timeRanges: input.timeRanges,
        timeInterval: input.timeInterval,
        attendees: [{ type: "USER", code: "Administrator" }],
        facilities: [{ id: "1" }, { id: "2" }],
        facilitySearchCondition: "AND",
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.availableTimes).toHaveLength(2);

    expect(structuredContent.result.availableTimes[0].facility).toBeUndefined();
    expect(structuredContent.result.availableTimes[1].facility).toBeUndefined();
  });

  it("should handle request with only required fields", async () => {
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
    };

    const result = await searchAvailableTimesHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/searchAvailableTimes",
      JSON.stringify({
        timeRanges: input.timeRanges,
        timeInterval: input.timeInterval,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.availableTimes).toHaveLength(1);
  });
});
