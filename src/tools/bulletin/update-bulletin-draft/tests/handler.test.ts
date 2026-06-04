import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateBulletinDraftHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    patchRequest: vi.fn(),
  };
});

describe("updateBulletinDraftHandler", () => {
  const mockPatchRequest = vi.mocked(client.patchRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully update a bulletin draft with minimal input", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Updated Draft",
      isDraft: true,
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
      subject: "Updated Draft",
    };

    const result = await updateBulletinDraftHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/draft/1",
      JSON.stringify({ subject: "Updated Draft" }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should successfully update a bulletin draft with all fields", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Full Draft Update",
      body: "<p>Updated</p>",
      isHtmlBody: true,
      isDraft: true,
      allowComments: false,
      operatorType: "SELECT_USERS",
      operators: [{ id: "5", name: "Admin" }],
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
      subject: "Full Draft Update",
      body: "<p>Updated</p>",
      isHtmlBody: true,
      manuallySender: { id: "2" },
      allowComments: false,
      operatorType: "SELECT_USERS" as const,
      operators: [{ id: "5" }],
      attachments: [{ name: "file.txt", content: "dGVzdA==" }],
      publicPeriod: { isUnlimited: true },
      isDraft: true,
      isNotified: false,
      mentions: [{ id: "3", type: "USER" }],
    };

    const result = await updateBulletinDraftHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/draft/1",
      JSON.stringify({
        subject: "Full Draft Update",
        body: "<p>Updated</p>",
        isHtmlBody: true,
        manuallySender: { id: "2" },
        allowComments: false,
        operatorType: "SELECT_USERS",
        operators: [{ id: "5" }],
        attachments: [{ name: "file.txt", content: "dGVzdA==" }],
        publicPeriod: { isUnlimited: true },
        isDraft: true,
        isNotified: false,
        mentions: [{ id: "3", type: "USER" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should publish a draft by setting isDraft to false", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Published Topic",
      isDraft: false,
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
      isDraft: false,
    };

    const result = await updateBulletinDraftHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/draft/1",
      JSON.stringify({ isDraft: false }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.isDraft).toBe(false);
  });
});
