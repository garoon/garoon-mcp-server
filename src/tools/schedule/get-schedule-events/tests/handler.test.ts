import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getScheduleEventsHandler } from "../handler.js";
import * as client from "../../../../client.js";
import { setConfig, type Config } from "../../../../config.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

const baseConfig: Config = {
  baseUrl: "https://example.cybozu.com",
  username: "user",
  password: "secret",
  publicOnly: false,
};

describe("getScheduleEventsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
    setConfig({ ...baseConfig });
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

    const result = await getScheduleEventsHandler(input);

    const expectedParams = new URLSearchParams({
      rangeStart: input.rangeStart,
      rangeEnd: input.rangeEnd,
      target: input.target,
      targetType: input.targetType,
    });

    expect(mockGetRequest).toHaveBeenCalledWith(
      `/api/v1/schedule/events?${expectedParams.toString()}`,
    );

    expect(result).toEqual(mockApiResponse);
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

    await getScheduleEventsHandler(input);

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

    await getScheduleEventsHandler(input);

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

    await getScheduleEventsHandler(input);

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

    const result = await getScheduleEventsHandler(input);

    const output = result;
    expect(output.events).toHaveLength(0);
    expect(output.hasNext).toBe(false);
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

    const result = await getScheduleEventsHandler(input);

    const output = result;
    expect(output.events).toHaveLength(2);
    expect(output.hasNext).toBe(true);
    expect(output.events[0].subject).toBe("Event 1");
    expect(output.events[1].subject).toBe("Event 2");
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

    const result = await getScheduleEventsHandler(input);

    expect(result).toEqual(mockApiResponse);
  });

  it("should not filter events when publicOnly is disabled", async () => {
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

    const result = await getScheduleEventsHandler(input);

    const output = result;
    expect(output.events.length).toBeGreaterThan(0);
  });

  describe("public-only mode", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      setConfig({ ...baseConfig, publicOnly: true });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should filter out private events when publicOnly is true", async () => {
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

      const result = await getScheduleEventsHandler(input);

      const callArgs = mockGetRequest.mock.calls[0][0];
      expect(callArgs).toContain("showPrivate=false");

      const output = result;
      expect(output.events).toHaveLength(1);
      expect(output.events[0].subject).toBe("Public Event");
      expect(output.events[0].visibilityType).toBe("PUBLIC");
    });

    it("should override showPrivate parameter when publicOnly is true", async () => {
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

      await getScheduleEventsHandler(input);

      const callArgs = mockGetRequest.mock.calls[0][0];
      expect(callArgs).toContain("showPrivate=false");
    });

    it("should handle mixed visibility events when publicOnly is true", async () => {
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

      const result = await getScheduleEventsHandler(input);

      const output = result;

      expect(output.events).toHaveLength(2);
      expect(output.events[0].subject).toBe("Public Event 1");
      expect(output.events[1].subject).toBe("Public Event 2");
      expect(
        output.events.every((event: any) => event.visibilityType === "PUBLIC"),
      ).toBe(true);
    });
  });
});
