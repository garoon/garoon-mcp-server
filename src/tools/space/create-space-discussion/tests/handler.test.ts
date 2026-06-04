import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createSpaceDiscussionHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("createSpaceDiscussionHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create discussion with title only", async () => {
    const mockApiResponse = {
      id: "10",
      title: "New Discussion",
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const result = await createSpaceDiscussionHandler(
      { spaceId: "5", title: "New Discussion" },
      {} as any,
    );

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/space/5/discussions",
      JSON.stringify({ title: "New Discussion" }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should create discussion with all fields", async () => {
    const mockApiResponse = {
      id: "10",
      title: "New Discussion",
      body: "<p>HTML body</p>",
      isHtmlBody: true,
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const result = await createSpaceDiscussionHandler(
      {
        spaceId: "5",
        title: "New Discussion",
        body: "<p>HTML body</p>",
        isHtmlBody: true,
      },
      {} as any,
    );

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/space/5/discussions",
      JSON.stringify({
        title: "New Discussion",
        body: "<p>HTML body</p>",
        isHtmlBody: true,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
