import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateBulletinTopicHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    patchRequest: vi.fn(),
  };
});

describe("updateBulletinTopicHandler", () => {
  const mockPatchRequest = vi.mocked(client.patchRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully update a bulletin topic with minimal input", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Updated Topic",
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
      subject: "Updated Topic",
    };

    const result = await updateBulletinTopicHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/1",
      JSON.stringify({ subject: "Updated Topic" }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should successfully update a bulletin topic with all fields", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Full Update",
      body: "<p>Updated</p>",
      isHtmlBody: true,
      allowComments: false,
      operatorType: "SELECT_USERS",
      operators: [{ id: "5", name: "Admin" }],
      attachments: [],
      publicPeriod: { isUnlimited: true },
      mentions: [{ id: "3", type: "USER" }],
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
      subject: "Full Update",
      body: "<p>Updated</p>",
      isHtmlBody: true,
      manuallySender: { id: "2" },
      allowComments: false,
      operatorType: "SELECT_USERS" as const,
      operators: [{ id: "5" }],
      attachments: [{ name: "new.txt", content: "dGVzdA==" }],
      publicPeriod: { isUnlimited: true },
      isNotified: true,
      mentions: [{ id: "3", type: "USER" }],
    };

    const result = await updateBulletinTopicHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/1",
      JSON.stringify({
        subject: "Full Update",
        body: "<p>Updated</p>",
        isHtmlBody: true,
        manuallySender: { id: "2" },
        allowComments: false,
        operatorType: "SELECT_USERS",
        operators: [{ id: "5" }],
        attachments: [{ name: "new.txt", content: "dGVzdA==" }],
        publicPeriod: { isUnlimited: true },
        isNotified: true,
        mentions: [{ id: "3", type: "USER" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should only send provided fields in the request body", async () => {
    const mockApiResponse = {
      id: "1",
      body: "New body only",
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse);

    const input = {
      topicId: "1",
      body: "New body only",
    };

    const result = await updateBulletinTopicHandler(input, {} as any);

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/1",
      JSON.stringify({ body: "New body only" }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
