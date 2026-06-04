import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deleteScheduleEventHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    deleteRequest: vi.fn(),
  };
});

describe("deleteScheduleEventHandler", () => {
  const mockDeleteRequest = vi.mocked(client.deleteRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should delete a schedule event", async () => {
    mockDeleteRequest.mockResolvedValue(undefined);

    const result = await deleteScheduleEventHandler(
      { eventId: "123" },
      {} as any,
    );

    expect(mockDeleteRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/123",
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual({ success: true });
  });

  it("should encode eventId in URL", async () => {
    mockDeleteRequest.mockResolvedValue(undefined);

    await deleteScheduleEventHandler({ eventId: "456" }, {} as any);

    expect(mockDeleteRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/456",
    );
  });
});
