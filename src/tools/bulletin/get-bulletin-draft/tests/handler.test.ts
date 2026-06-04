import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBulletinDraftHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getBulletinDraftHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get a bulletin draft", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Draft Topic",
      body: "Draft body",
      isDraft: true,
      category: { id: "10", name: "General" },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
    };

    const result = await getBulletinDraftHandler(input, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/draft/1",
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should use correct endpoint with topic ID", async () => {
    const mockApiResponse = {
      id: "42",
      subject: "Another Draft",
      isDraft: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "42",
    };

    await getBulletinDraftHandler(input, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/draft/42",
    );
  });

  it("should return full topic detail for draft", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Draft with all fields",
      body: "<p>HTML draft</p>",
      isHtmlBody: true,
      isDraft: true,
      creator: { id: "1", code: "user1", name: "User 1" },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
      category: { id: "10", name: "General" },
      allowComments: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
    };

    const result = await getBulletinDraftHandler(input, {} as any);

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.isDraft).toBe(true);
    expect(structuredContent.result.subject).toBe("Draft with all fields");
  });
});
