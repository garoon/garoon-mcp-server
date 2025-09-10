import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createScheduleEventHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("createScheduleEventHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully create schedule event with minimal input", async () => {
    const mockApiResponse = {
      id: "123",
      eventType: "REGULAR",
      subject: "New Schedule",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
    };

    const result = await createScheduleEventHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
      }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should successfully create schedule event with all fields", async () => {
    const mockApiResponse = {
      id: "456",
      eventType: "REGULAR",
      eventMenu: "Meeting",
      subject: "Test Event",
      notes: "Test notes",
      visibilityType: "PUBLIC",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T12:00:00+09:00",
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
          code: "f1",
          name: "f1",
        },
      ],
      facilityUsingPurpose: "Meeting room",
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
      subject: "Test Event",
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T12:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      eventType: "REGULAR" as const,
      eventMenu: "Meeting",
      notes: "Test notes",
      visibilityType: "PUBLIC" as const,
      attendees: [
        { type: "USER" as const, id: "1" },
        { type: "USER" as const, code: "user2" },
      ],
      facilities: [{ id: "1" }, { code: "facility2" }],
      facilityUsingPurpose: "Meeting room",
      watchers: [
        { type: "USER" as const, id: "2" },
        { type: "ORGANIZATION" as const, code: "org1" },
      ],
      isStartOnly: false,
      isAllDay: false,
    };

    const result = await createScheduleEventHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        eventType: "REGULAR",
        subject: "Test Event",
        visibilityType: "PUBLIC",
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T12:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        isStartOnly: false,
        isAllDay: false,
        attendees: [
          { type: "USER", id: "1" },
          { type: "USER", code: "user2" },
        ],
        eventMenu: "Meeting",
        notes: "Test notes",
        facilities: [{ id: "1" }, { code: "facility2" }],
        facilityUsingPurpose: "Meeting room",
        watchers: [
          { type: "USER", id: "2" },
          { type: "ORGANIZATION", code: "org1" },
        ],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should handle ALL_DAY event type", async () => {
    const mockApiResponse = {
      id: "789",
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
      isAllDay: true,
    };

    const result = await createScheduleEventHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        eventType: "ALL_DAY",
        subject: "All Day Event",
        start: {
          dateTime: "2024-07-27T00:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T23:59:59+09:00",
          timeZone: "Asia/Tokyo",
        },
        isAllDay: true,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should handle start-only event", async () => {
    const mockApiResponse = {
      id: "101",
      eventType: "REGULAR",
      subject: "Start Only Event",
      isStartOnly: true,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "Start Only Event",
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      isStartOnly: true,
    };

    const result = await createScheduleEventHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events",
      JSON.stringify({
        subject: "Start Only Event",
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        isStartOnly: true,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
