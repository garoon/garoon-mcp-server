import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getScheduleEventCommentsHandler } from "../handler.js";
import * as client from "#client.js";

vi.mock("#client.js", async () => {
  const actual = await vi.importActual("#client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getScheduleEventCommentsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get comments with eventId only", async () => {
    const mockApiResponse = {
      comments: [
        {
          id: "1",
          body: "Please confirm your attendance.",
          createdAt: "2024-04-19T04:46:25Z",
          creator: { id: "4", code: "user1", name: "Aki Tanaka" },
          mentions: [
            { type: "USER", id: "5", code: "user2", name: "Haru Yamada" },
          ],
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    const result = await getScheduleEventCommentsHandler({ eventId: "2" });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/2/comments?",
    );
    expect(result).toEqual(mockApiResponse);
  });

  it("should pass limit and offset as query parameters", async () => {
    mockGetRequest.mockResolvedValue({ comments: [], hasNext: false });

    await getScheduleEventCommentsHandler({
      eventId: "2",
      limit: 5,
      offset: 10,
    });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/events/2/comments?limit=5&offset=10",
    );
  });

  it("should return an empty comment list", async () => {
    const mockApiResponse = { comments: [], hasNext: false };
    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getScheduleEventCommentsHandler({ eventId: "2" });

    expect(result).toEqual(mockApiResponse);
  });

  it("should propagate errors from the client", async () => {
    const httpError = new client.HttpErrorResponse(
      404,
      "GRN_SCHD_13001: Cannot perform actions on this appointment.",
    );
    mockGetRequest.mockRejectedValue(httpError);

    await expect(
      getScheduleEventCommentsHandler({ eventId: "999999" }),
    ).rejects.toBe(httpError);
  });
});
