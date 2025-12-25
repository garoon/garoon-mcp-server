import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getScheduleEventsHandler } from "../handler.js";
import * as client from "../../../../client.js";
import * as constants from "../../../../constants.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getScheduleEventsHandler", () => {
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

    const result = await getScheduleEventsHandler(input, {} as any);

    const expectedParams = new URLSearchParams({
      rangeStart: input.rangeStart,
      rangeEnd: input.rangeEnd,
      target: input.target,
      targetType: input.targetType,
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

    await getScheduleEventsHandler(input, {} as any);

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

    await getScheduleEventsHandler(input, {} as any);

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

    await getScheduleEventsHandler(input, {} as any);

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

    const result = await getScheduleEventsHandler(input, {} as any);

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

    const result = await getScheduleEventsHandler(input, {} as any);

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

    const result = await getScheduleEventsHandler(input, {} as any);

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(typeof result.content[0].text).toBe("string");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should not filter events when IS_PUBLIC_ONLY is disabled (the filter is applied in handler based on PUBLIC_ONLY from index.ts)", async () => {
    const mockApiResponse = {
      events: [
        {
          id: "1",
          subject: "Public Event",
          visibilityType: "PUBLIC",
          start: {
            dateTime: "2024-01-01T10:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
        },
        {
          id: "2",
          subject: "Private Event",
          visibilityType: "PRIVATE",
          start: {
            dateTime: "2024-01-02T14:00:00+09:00",
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

    const result = await getScheduleEventsHandler(input, {} as any);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.events.length).toBeGreaterThan(0);
  });

  describe("IS_PUBLIC_ONLY mode", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(constants, "IS_PUBLIC_ONLY", "get").mockReturnValue(true);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should filter out private events when IS_PUBLIC_ONLY is true", async () => {
      const mockApiResponse = {
        events: [
          {
            id: "1",
            subject: "Public Event",
            visibilityType: "PUBLIC",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            id: "2",
            subject: "Private Event",
            visibilityType: "PRIVATE",
            start: {
              dateTime: "2024-01-02T14:00:00+09:00",
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
        showPrivate: true,
      };

      const result = await getScheduleEventsHandler(input, {} as any);

      const callArgs = mockGetRequest.mock.calls[0][0];
      expect(callArgs).toContain("showPrivate=false");

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.result.events).toHaveLength(1);
      expect(structuredContent.result.events[0].subject).toBe("Public Event");
      expect(structuredContent.result.events[0].visibilityType).toBe("PUBLIC");
    });

    it("should override showPrivate parameter when IS_PUBLIC_ONLY is true", async () => {
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
        showPrivate: true,
      };

      await getScheduleEventsHandler(input, {} as any);

      const callArgs = mockGetRequest.mock.calls[0][0];
      expect(callArgs).toContain("showPrivate=false");
    });

    it("should handle mixed visibility events when IS_PUBLIC_ONLY is true", async () => {
      const mockApiResponse = {
        events: [
          {
            id: "1",
            subject: "Public Event 1",
            visibilityType: "PUBLIC",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            id: "2",
            subject: "Private Event",
            visibilityType: "PRIVATE",
            start: {
              dateTime: "2024-01-02T14:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            id: "3",
            subject: "Public Event 2",
            visibilityType: "PUBLIC",
            start: {
              dateTime: "2024-01-03T16:00:00+09:00",
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

      const result = await getScheduleEventsHandler(input, {} as any);

      const structuredContent = result.structuredContent as any;

      expect(structuredContent.result.events).toHaveLength(2);
      expect(structuredContent.result.events[0].subject).toBe("Public Event 1");
      expect(structuredContent.result.events[1].subject).toBe("Public Event 2");
      expect(
        structuredContent.result.events.every(
          (event: any) => event.visibilityType === "PUBLIC",
        ),
      ).toBe(true);
    });
  });
});
