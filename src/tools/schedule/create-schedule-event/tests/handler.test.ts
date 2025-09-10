import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createScheduleEventHandler } from "../handler.js";
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

describe("createScheduleEventHandler", () => {
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

  it("should successfully create schedule event with all fields", async () => {
    const mockApiResponse = {
      id: "12345",
      eventType: "REGULAR",
      eventMenu: "Meeting",
      subject: "Team Meeting",
      notes: "Weekly team sync",
      visibilityType: "PUBLIC",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T10:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [
        {
          type: "USER",
          id: "1",
          code: "user1",
          name: "User 1",
        },
      ],
      facilities: [
        {
          id: "1",
          code: "room1",
          name: "Conference Room A",
        },
      ],
      facilityUsingPurpose: "Meeting room booking",
      watchers: [
        {
          type: "USER",
          id: "2",
          code: "user2",
          name: "User 2",
        },
      ],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "Team Meeting",
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T10:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      eventType: "REGULAR" as const,
      eventMenu: "Meeting",
      notes: "Weekly team sync",
      visibilityType: "PUBLIC" as const,
      isStartOnly: false,
      isAllDay: false,
      attendees: [
        { type: "USER" as const, id: "1" },
        { type: "USER" as const, code: "user2" },
      ],
      facilities: [{ id: "1" }, { code: "room2" }],
      facilityUsingPurpose: "Meeting room booking",
      watchers: [
        { type: "USER" as const, id: "2" },
        { type: "ROLE" as const, code: "admin" },
      ],
    };

    const result = await createScheduleEventHandler(input, mockExtra);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        eventType: "REGULAR",
        subject: "Team Meeting",
        visibilityType: "PUBLIC",
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T10:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        isStartOnly: false,
        isAllDay: false,
        attendees: [
          { type: "USER", id: "1" },
          { type: "USER", code: "user2" },
        ],
        eventMenu: "Meeting",
        notes: "Weekly team sync",
        facilities: [{ id: "1" }, { code: "room2" }],
        facilityUsingPurpose: "Meeting room booking",
        watchers: [
          { type: "USER", id: "2" },
          { type: "ROLE", code: "admin" },
        ],
      }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
  });

  it("should create schedule event without optional fields", async () => {
    const mockApiResponse = {
      id: "12345",
      eventType: "REGULAR",
      subject: "Simple Event",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "Simple Event",
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      eventType: "REGULAR" as const,
      visibilityType: "PUBLIC" as const,
      isStartOnly: false,
      isAllDay: false,
    };

    const result = await createScheduleEventHandler(input, mockExtra);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        eventType: "REGULAR",
        subject: "Simple Event",
        visibilityType: "PUBLIC",
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        isStartOnly: false,
        isAllDay: false,
        attendees: undefined,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.id).toBe("12345");
  });

  it("should create isStartOnly event", async () => {
    const mockApiResponse = {
      id: "12345",
      eventType: "REGULAR",
      subject: "Start Only Event",
      isStartOnly: true,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "Start Only Event",
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      eventType: "REGULAR" as const,
      visibilityType: "PUBLIC" as const,
      isStartOnly: true,
      isAllDay: false,
    };

    const result = await createScheduleEventHandler(input, mockExtra);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        eventType: "REGULAR",
        subject: "Start Only Event",
        visibilityType: "PUBLIC",
        start: {
          dateTime: "2024-07-27T09:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        isStartOnly: true,
        isAllDay: false,
        attendees: undefined,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.isStartOnly).toBe(true);
  });

  it("should create all-day event", async () => {
    const mockApiResponse = {
      id: "12345",
      eventType: "ALL_DAY",
      subject: "All Day Event",
      isStartOnly: false,
      isAllDay: true,
      start: {
        dateTime: "2024-07-27T00:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T23:59:59+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "All Day Event",
      start: {
        dateTime: "2024-07-27T00:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T23:59:59+09:00",
        timeZone: "Asia/Tokyo",
      },
      eventType: "ALL_DAY" as const,
      visibilityType: "PUBLIC" as const,
      isStartOnly: false,
      isAllDay: true,
    };

    const result = await createScheduleEventHandler(input, mockExtra);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        eventType: "ALL_DAY",
        subject: "All Day Event",
        visibilityType: "PUBLIC",
        start: {
          dateTime: "2024-07-27T00:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T23:59:59+09:00",
          timeZone: "Asia/Tokyo",
        },
        isStartOnly: false,
        isAllDay: true,
        attendees: undefined,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.isError).toBe(false);
    expect(structuredContent.result.isAllDay).toBe(true);
  });

  it("should handle API errors gracefully", async () => {
    const error = new Error("API Error");
    mockPostRequest.mockRejectedValue(error);

    const input = {
      subject: "Test Event",
      start: {
        dateTime: "2024-07-27T09:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      eventType: "REGULAR" as const,
      visibilityType: "PUBLIC" as const,
      isStartOnly: false,
      isAllDay: false,
    };

    await expect(createScheduleEventHandler(input, mockExtra)).rejects.toThrow(
      "API Error",
    );
  });
});
