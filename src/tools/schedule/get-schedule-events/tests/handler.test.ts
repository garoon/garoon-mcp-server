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

  it("should successfully search events with userId", async () => {
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

  it("should resolve userName to userId and search events", async () => {
    const mockUserResponse = {
      users: [
        {
          id: "456",
          name: "Test User",
          code: "test_user",
        },
      ],
    };

    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest
      .mockResolvedValueOnce(mockUserResponse)
      .mockResolvedValueOnce(mockApiResponse);

    const input = {
      userName: "Test User",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    expect(mockGetRequest).toHaveBeenCalledTimes(2);
    expect(mockGetRequest).toHaveBeenNthCalledWith(
      1,
      "/api/v1/base/users?name=Test%20User",
    );

    const secondCallArgs = mockGetRequest.mock.calls[1][0];
    expect(secondCallArgs).toContain("target=456");
    expect(secondCallArgs).toContain("targetType=user");
  });

  it("should handle encoded special characters in userName", async () => {
    const mockUserResponse = {
      users: [
        {
          id: "789",
          name: "田中太郎",
          code: "t-tanaka",
        },
      ],
    };

    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest
      .mockResolvedValueOnce(mockUserResponse)
      .mockResolvedValueOnce(mockApiResponse);

    const input = {
      userName: "田中太郎",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    expect(mockGetRequest).toHaveBeenNthCalledWith(
      1,
      "/api/v1/base/users?name=%E7%94%B0%E4%B8%AD%E5%A4%AA%E9%83%8E",
    );
  });

  it("should successfully search events with organizationId", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      organizationId: "789",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    const callArgs = mockGetRequest.mock.calls[0][0];
    expect(callArgs).toContain("target=789");
    expect(callArgs).toContain("targetType=organization");
  });

  it("should resolve organizationName to organizationId", async () => {
    const mockOrgResponse = {
      organizations: [
        {
          id: "101",
          name: "Sales Department",
          code: "sales",
        },
      ],
    };

    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest
      .mockResolvedValueOnce(mockOrgResponse)
      .mockResolvedValueOnce(mockApiResponse);

    const input = {
      organizationName: "Sales Department",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    expect(mockGetRequest).toHaveBeenCalledTimes(2);
    expect(mockGetRequest).toHaveBeenNthCalledWith(
      1,
      "/api/v1/base/organizations?name=Sales%20Department",
    );

    const secondCallArgs = mockGetRequest.mock.calls[1][0];
    expect(secondCallArgs).toContain("target=101");
    expect(secondCallArgs).toContain("targetType=organization");
  });

  it("should successfully search events with facilityId", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      facilityId: "202",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    const callArgs = mockGetRequest.mock.calls[0][0];
    expect(callArgs).toContain("target=202");
    expect(callArgs).toContain("targetType=facility");
  });

  it("should resolve facilityName to facilityId", async () => {
    const mockFacilityResponse = {
      facilities: [
        {
          id: "303",
          name: "Conference Room A",
          code: "room_a",
        },
      ],
    };

    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest
      .mockResolvedValueOnce(mockFacilityResponse)
      .mockResolvedValueOnce(mockApiResponse);

    const input = {
      facilityName: "Conference Room A",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    expect(mockGetRequest).toHaveBeenCalledTimes(2);
    expect(mockGetRequest).toHaveBeenNthCalledWith(
      1,
      "/api/v1/schedule/facilities?name=Conference%20Room%20A",
    );

    const secondCallArgs = mockGetRequest.mock.calls[1][0];
    expect(secondCallArgs).toContain("target=303");
    expect(secondCallArgs).toContain("targetType=facility");
  });

  it("should handle complete input with all optional parameters", async () => {
    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      userId: "123",
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
      userId: "456",
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

  it("should throw error when userName not found", async () => {
    const mockUserResponse = {
      users: [],
    };

    mockGetRequest.mockResolvedValue(mockUserResponse);

    const input = {
      userName: "NonExistent User",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await expect(searchScheduleEventsHandler(input, {} as any)).rejects.toThrow(
      "User not found: NonExistent User",
    );
  });

  it("should throw error when multiple users found", async () => {
    const mockUserResponse = {
      users: [
        { id: "1", name: "John", code: "john1" },
        { id: "2", name: "John", code: "john2" },
      ],
    };

    mockGetRequest.mockResolvedValue(mockUserResponse);

    const input = {
      userName: "John",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await expect(searchScheduleEventsHandler(input, {} as any)).rejects.toThrow(
      "Multiple Users found for: John. Please use UserId instead.",
    );
  });

  it("should throw error when no target provided", async () => {
    const input = {
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await expect(searchScheduleEventsHandler(input, {} as any)).rejects.toThrow(
      "Must provide either user, organization, or facility target",
    );
  });

  it("should throw error when multiple target types provided", async () => {
    const input = {
      userId: "123",
      organizationId: "456",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await expect(searchScheduleEventsHandler(input, {} as any)).rejects.toThrow(
      "Only one target type (user, organization, or facility) can be specified",
    );
  });

  it("should handle special characters in organization and facility names", async () => {
    const mockOrgResponse = {
      organizations: [
        {
          id: "999",
          name: "R&D部門",
          code: "rd_dept",
        },
      ],
    };

    const mockApiResponse = {
      events: [],
      hasNext: false,
    };

    mockGetRequest
      .mockResolvedValueOnce(mockOrgResponse)
      .mockResolvedValueOnce(mockApiResponse);

    const input = {
      organizationName: "R&D部門",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    await searchScheduleEventsHandler(input, {} as any);

    expect(mockGetRequest).toHaveBeenNthCalledWith(
      1,
      "/api/v1/base/organizations?name=R%26D%E9%83%A8%E9%96%80",
    );
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
      userId: "123",
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
