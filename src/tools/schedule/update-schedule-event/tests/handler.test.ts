import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateScheduleEventHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    patchRequest: vi.fn(),
  };
});

describe("updateScheduleEventHandler", () => {
  const mockPatchRequest = vi.mocked(client.patchRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should update a schedule event with subject only", async () => {
    const mockApiResponse = {
      id: "123",
      eventType: "REGULAR",
      subject: "Updated Subject",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      eventId: "123",
      subject: "Updated Subject",
    };

    const result = await updateScheduleEventHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/123",
      JSON.stringify({ subject: "Updated Subject" }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should update a schedule event with all fields", async () => {
    const mockApiResponse = {
      id: "456",
      eventType: "REGULAR",
      eventMenu: "Meeting",
      subject: "Full Update",
      notes: "Updated notes",
      visibilityType: "PRIVATE",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T14:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T15:00:00+09:00",
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
          name: "Room A",
        },
      ],
      watchers: [
        {
          type: "USER",
          id: "2",
          code: "user2",
          name: "User 2",
        },
      ],
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      eventId: "456",
      subject: "Full Update",
      notes: "Updated notes",
      eventMenu: "Meeting",
      start: {
        dateTime: "2024-07-27T14:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: "2024-07-27T15:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      isAllDay: false,
      isStartOnly: false,
      visibilityType: "PRIVATE" as const,
      attendees: [{ type: "USER" as const, id: "1" }],
      facilities: [{ id: "1" }],
      watchers: [{ type: "USER" as const, id: "2" }],
    };

    const result = await updateScheduleEventHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/456",
      JSON.stringify({
        subject: "Full Update",
        notes: "Updated notes",
        eventMenu: "Meeting",
        start: {
          dateTime: "2024-07-27T14:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T15:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        isAllDay: false,
        isStartOnly: false,
        visibilityType: "PRIVATE",
        attendees: [{ type: "USER", id: "1" }],
        facilities: [{ id: "1" }],
        watchers: [{ type: "USER", id: "2" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should handle attendees with code instead of id", async () => {
    const mockApiResponse = {
      id: "789",
      eventType: "REGULAR",
      subject: "Test",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      eventId: "789",
      attendees: [{ type: "USER" as const, code: "user1" }],
      facilities: [{ code: "room1" }],
      watchers: [{ type: "ORGANIZATION" as const, code: "org1" }],
    };

    const result = await updateScheduleEventHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/789",
      JSON.stringify({
        attendees: [{ type: "USER", code: "user1" }],
        facilities: [{ code: "room1" }],
        watchers: [{ type: "ORGANIZATION", code: "org1" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
