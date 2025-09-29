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

  it("should successfully search events with user target", async () => {
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
      target: "123",
      targetType: "user" as const,
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input, {} as any);

    const expectedParams = new URLSearchParams({
      fields:
        "id,subject,start,end,notes,eventType,eventMenu,visibilityType,isStartOnly,isAllDay,attendees,facilities,facilityUsingPurpose,watchers",
      rangeStart: input.rangeStart,
      rangeEnd: input.rangeEnd,
      target: input.target,
      targetType: input.targetType,
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

  it("should successfully search events with organization target", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      target: "789",
      targetType: "organization" as const,
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    const callArgs = mockGetRequest.mock.calls[0][0];
    expect(callArgs).toContain("target=789");
    expect(callArgs).toContain("targetType=organization");
  });

  it("should successfully search events with facility target", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      target: "202",
      targetType: "facility" as const,
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    const callArgs = mockGetRequest.mock.calls[0][0];
    expect(callArgs).toContain("target=202");
    expect(callArgs).toContain("targetType=facility");
  });

  it("should handle complete input with all optional parameters", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      target: "123",
      targetType: "user" as const,
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
      showPrivate: false,
      limit: 25,
      offset: 5,
    };

    await searchScheduleEventsHandler(input, {} as any);

    const callArgs = mockGetRequest.mock.calls[0][0];
    expect(callArgs).toContain("showPrivate=false");
    expect(callArgs).toContain("limit=25");
    expect(callArgs).toContain("offset=5");
  });

  it("should handle empty events result", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      target: "456",
      targetType: "user" as const,
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input, {} as any);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.events).toHaveLength(0);
    expect(structuredContent.result.hasNext).toBe(false);
  });

  it("should handle multiple events with pagination", async () => {
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
      target: "789",
      targetType: "user" as const,
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

  it("should return proper response structure", async () => {
    const mockApiResponse = {
      events: [
        {
          id: "123",
          subject: "Test Event",
          start: {
            dateTime: "2024-01-01T10:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      target: "123",
      targetType: "user" as const,
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    const result = await searchScheduleEventsHandler(input, {} as any);

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(typeof result.content[0].text).toBe("string");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
