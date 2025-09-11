import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { searchScheduleEventsHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

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

    const result = await searchScheduleEventsHandler(input, {} as any);

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

  it("should handle empty events result", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      userId: "456",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input, {} as any);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.events).toHaveLength(0);
    expect(structuredContent.result.hasNext).toBe(false);
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
          notes: "Notes 1",
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
          notes: "Notes 2",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      userId: "789",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input, {} as any);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.events).toHaveLength(2);
    expect(structuredContent.result.hasNext).toBe(true);
    expect(structuredContent.result.events[0].subject).toBe("Event 1");
    expect(structuredContent.result.events[1].subject).toBe("Event 2");
  });
});
