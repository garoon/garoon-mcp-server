import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getScheduleDatastoreHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getScheduleDatastoreHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get datastore data for a schedule event", async () => {
    const mockApiResponse = {
      value: {
        key1: "value1",
        key2: 42,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getScheduleDatastoreHandler(
      { eventId: "123", customizeName: "myApp" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/123/datastore/myApp",
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should encode path parameters", async () => {
    const mockApiResponse = {
      value: {},
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getScheduleDatastoreHandler(
      { eventId: "456", customizeName: "my app" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/456/datastore/my%20app",
    );
  });
});
