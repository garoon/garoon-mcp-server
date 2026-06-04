import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNotificationsHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getNotificationsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get notifications without parameters", async () => {
    const mockApiResponse = {
      items: [
        {
          moduleId: "grn.schedule",
          creator: {
            id: "1",
            code: "admin",
            name: "Administrator",
          },
          createdAt: "2024-01-01T00:00:00+09:00",
          operation: "add",
          url: "https://example.com/schedule/1",
          title: "New Schedule Event",
          body: "A new event has been created",
          icon: "https://example.com/icon.png",
          isRead: false,
        },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: mockApiResponse,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getNotificationsHandler({}, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/notification/items?");

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should successfully get notifications with fields parameter", async () => {
    const mockApiResponse = {
      items: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getNotificationsHandler({ fields: "title,body" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/notification/items?fields=title%2Cbody",
    );
  });

  it("should successfully get notifications with limit and offset", async () => {
    const mockApiResponse = {
      items: [],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getNotificationsHandler({ limit: 50, offset: 100 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/notification/items?limit=50&offset=100",
    );
  });

  it("should successfully get notifications with all parameters", async () => {
    const mockApiResponse = {
      items: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getNotificationsHandler(
      { fields: "title", limit: 10, offset: 20 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/notification/items?fields=title&limit=10&offset=20",
    );
  });

  it("should handle zero limit and offset values by omitting them", async () => {
    const mockApiResponse = {
      items: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getNotificationsHandler({ limit: 0, offset: 0 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/notification/items?");
  });
});
