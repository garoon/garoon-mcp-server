import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { searchScheduleEventsHandler } from "../handler.js";
import * as client from "../../../../client.js";

// Mock the client module
vi.mock("../../../../client.js", () => ({
  getRequest: vi.fn(),
}));

describe("searchScheduleEventsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    const result = await searchScheduleEventsHandler(input);

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
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should handle empty events response", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      userId: "123",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input);

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should handle multiple events with hasNext true", async () => {
    const mockApiResponse = {
      events: [
        {
          id: "1",
          subject: "Event 1",
          start: {
            dateTime: "2024-01-01T10:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-01-01T11:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          notes: "First event",
        },
        {
          id: "2",
          subject: "Event 2",
          start: {
            dateTime: "2024-01-02T14:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-01-02T15:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          notes: "Second event",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      userId: "456",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-31T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input);

    expect(mockGetRequest).toHaveBeenCalledWith(
      expect.stringContaining("target=456"),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.events).toHaveLength(2);
    expect(structuredContent.result.hasNext).toBe(true);
  });

  it("should handle different time zones", async () => {
    const mockApiResponse = {
      events: [
        {
          id: "789",
          subject: "UTC Event",
          start: {
            dateTime: "2024-01-01T01:00:00Z",
            timeZone: "UTC",
          },
          end: {
            dateTime: "2024-01-01T02:00:00Z",
            timeZone: "UTC",
          },
          notes: "UTC timezone event",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      userId: "789",
      rangeStart: "2024-01-01T00:00:00Z",
      rangeEnd: "2024-01-01T23:59:59Z",
    };

    const result = await searchScheduleEventsHandler(input);

    expect(mockGetRequest).toHaveBeenCalledWith(
      expect.stringContaining("rangeStart=2024-01-01T00%3A00%3A00Z"),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.events[0].start.timeZone).toBe("UTC");
  });

  it("should handle events without notes", async () => {
    const mockApiResponse = {
      events: [
        {
          id: "999",
          subject: "Event without notes",
          start: {
            dateTime: "2024-01-01T10:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-01-01T11:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          notes: "",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      userId: "999",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.events[0].notes).toBe("");
  });

  it("should validate output schema", async () => {
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

    const result = await searchScheduleEventsHandler(input);

    // The handler should validate the output and not throw
    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
  });
});
