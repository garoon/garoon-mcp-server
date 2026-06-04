import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateScheduleDatastoreHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    putRequest: vi.fn(),
  };
});

describe("updateScheduleDatastoreHandler", () => {
  const mockPutRequest = vi.mocked(client.putRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should update datastore data for a schedule event", async () => {
    const mockApiResponse = {
      value: {
        key1: "updated",
        key2: 100,
      },
    };

    mockPutRequest.mockResolvedValue(mockApiResponse);

    const result = await updateScheduleDatastoreHandler(
      {
        eventId: "123",
        customizeName: "myApp",
        value: { key1: "updated", key2: 100 },
      },
      {} as any,
    );

    expect(mockPutRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/123/datastore/myApp",
      JSON.stringify({ value: { key1: "updated", key2: 100 } }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should encode path parameters", async () => {
    const mockApiResponse = {
      value: {},
    };

    mockPutRequest.mockResolvedValue(mockApiResponse);

    await updateScheduleDatastoreHandler(
      {
        eventId: "456",
        customizeName: "my app",
        value: { test: true },
      },
      {} as any,
    );

    expect(mockPutRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/456/datastore/my%20app",
      JSON.stringify({ value: { test: true } }),
    );
  });
});
