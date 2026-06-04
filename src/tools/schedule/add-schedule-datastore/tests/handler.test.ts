import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { addScheduleDatastoreHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("addScheduleDatastoreHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should add datastore data for a schedule event", async () => {
    const mockApiResponse = {
      value: {
        key1: "value1",
        key2: 42,
      },
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const result = await addScheduleDatastoreHandler(
      {
        eventId: "123",
        customizeName: "myApp",
        value: { key1: "value1", key2: 42 },
      },
      {} as any,
    );

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/123/datastore/myApp",
      JSON.stringify({ value: { key1: "value1", key2: 42 } }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should encode path parameters", async () => {
    const mockApiResponse = {
      value: {},
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    await addScheduleDatastoreHandler(
      {
        eventId: "456",
        customizeName: "my app",
        value: { test: true },
      },
      {} as any,
    );

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/456/datastore/my%20app",
      JSON.stringify({ value: { test: true } }),
    );
  });
});
