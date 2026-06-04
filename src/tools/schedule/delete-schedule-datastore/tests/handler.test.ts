import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deleteScheduleDatastoreHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    deleteRequest: vi.fn(),
  };
});

describe("deleteScheduleDatastoreHandler", () => {
  const mockDeleteRequest = vi.mocked(client.deleteRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should delete datastore data for a schedule event", async () => {
    mockDeleteRequest.mockResolvedValue(undefined);

    const result = await deleteScheduleDatastoreHandler(
      { eventId: "123", customizeName: "myApp" },
      {} as any,
    );

    expect(mockDeleteRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/123/datastore/myApp",
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual({ success: true });
  });

  it("should encode path parameters", async () => {
    mockDeleteRequest.mockResolvedValue(undefined);

    await deleteScheduleDatastoreHandler(
      { eventId: "456", customizeName: "my app" },
      {} as any,
    );

    expect(mockDeleteRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/456/datastore/my%20app",
    );
  });
});
