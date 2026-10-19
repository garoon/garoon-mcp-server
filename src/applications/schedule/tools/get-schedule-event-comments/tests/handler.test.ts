import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getScheduleEventCommentsHandler } from "../handler.js";
import * as client from "#client.js";
import { setConfig, type Config } from "#config.js";

vi.mock("#client.js", async () => {
  const actual = await vi.importActual("#client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

const baseConfig: Config = {
  baseUrl: "https://example.cybozu.com",
  username: "user",
  password: "secret",
  publicOnly: false,
};

describe("getScheduleEventCommentsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
    setConfig({ ...baseConfig });
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

    expect(mockGetRequest).toHaveBeenCalledTimes(1);
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

  describe("public-only mode", () => {
    const privateEventError =
      "Comments of a private event cannot be retrieved because Public Only Mode (GAROON_PUBLIC_ONLY) is enabled";

    beforeEach(() => {
      setConfig({ ...baseConfig, publicOnly: true });
    });

    it("should look up the event before fetching comments of a public event", async () => {
      const mockApiResponse = { comments: [], hasNext: false };
      mockGetRequest
        .mockResolvedValueOnce({ id: "2", visibilityType: "PUBLIC" })
        .mockResolvedValueOnce(mockApiResponse);

      const result = await getScheduleEventCommentsHandler({ eventId: "2" });

      expect(mockGetRequest).toHaveBeenCalledTimes(2);
      expect(mockGetRequest).toHaveBeenNthCalledWith(
        1,
        "/api/v1/schedule/events/2",
      );
      expect(mockGetRequest).toHaveBeenNthCalledWith(
        2,
        "/api/v1/schedule/events/2/comments?",
      );
      expect(result).toEqual(mockApiResponse);
    });

    it("should reject comments of a private event without fetching them", async () => {
      mockGetRequest.mockResolvedValueOnce({
        id: "2",
        visibilityType: "PRIVATE",
      });

      await expect(
        getScheduleEventCommentsHandler({ eventId: "2" }),
      ).rejects.toThrow(privateEventError);

      expect(mockGetRequest).toHaveBeenCalledTimes(1);
      expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/schedule/events/2");
    });

    it("should reject comments of an event without a visibility type without fetching them", async () => {
      mockGetRequest.mockResolvedValueOnce({ id: "2" });

      await expect(
        getScheduleEventCommentsHandler({ eventId: "2" }),
      ).rejects.toThrow(privateEventError);

      expect(mockGetRequest).toHaveBeenCalledTimes(1);
      expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/schedule/events/2");
    });

    it("should propagate errors from the event lookup without fetching comments", async () => {
      const httpError = new client.HttpErrorResponse(
        404,
        "GRN_SCHD_13001: Cannot perform actions on this appointment.",
      );
      mockGetRequest.mockRejectedValueOnce(httpError);

      await expect(
        getScheduleEventCommentsHandler({ eventId: "999999" }),
      ).rejects.toBe(httpError);

      expect(mockGetRequest).toHaveBeenCalledTimes(1);
      expect(mockGetRequest).toHaveBeenCalledWith(
        "/api/v1/schedule/events/999999",
      );
    });
  });
});
