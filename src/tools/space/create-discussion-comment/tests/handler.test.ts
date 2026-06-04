import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createDiscussionCommentHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("createDiscussionCommentHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create comment with required fields only", async () => {
    const mockApiResponse = {
      id: "20",
      spaceId: "5",
      discussionId: "10",
      body: "A comment",
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const result = await createDiscussionCommentHandler(
      { spaceId: "5", discussionId: "10", body: "A comment" },
      {} as any,
    );

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/space/5/discussions/10/comments",
      JSON.stringify({ body: "A comment" }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should create comment with all fields", async () => {
    const mockApiResponse = {
      id: "20",
      spaceId: "5",
      discussionId: "10",
      body: "<p>HTML comment</p>",
      isHtmlBody: true,
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const result = await createDiscussionCommentHandler(
      {
        spaceId: "5",
        discussionId: "10",
        body: "<p>HTML comment</p>",
        isHtmlBody: true,
      },
      {} as any,
    );

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/space/5/discussions/10/comments",
      JSON.stringify({
        body: "<p>HTML comment</p>",
        isHtmlBody: true,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
