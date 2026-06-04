import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getScheduleEventHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getScheduleEventHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get a schedule event by ID", async () => {
    const mockApiResponse = {
      id: "123",
      eventType: "REGULAR",
      subject: "Test Event",
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
      attendees: [],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getScheduleEventHandler({ eventId: "123" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/schedule/events/123");

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should get a schedule event with extended fields", async () => {
    const mockApiResponse = {
      id: "456",
      eventType: "REGULAR",
      subject: "Extended Event",
      isStartOnly: false,
      isAllDay: false,
      start: {
        dateTime: "2024-07-27T11:00:00+09:00",
        timeZone: "Asia/Tokyo",
      },
      attendees: [],
      useAttendanceCheck: true,
      companyInfo: {
        name: "Test Corp",
        phone: "03-1234-5678",
      },
      attachments: [
        {
          id: "1",
          name: "doc.pdf",
          contentType: "application/pdf",
          size: "1024",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getScheduleEventHandler({ eventId: "456" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/schedule/events/456");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should encode eventId in URL", async () => {
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

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getScheduleEventHandler({ eventId: "789" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/schedule/events/789");
  });
});
