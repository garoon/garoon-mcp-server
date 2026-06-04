import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createBulletinTopicHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("createBulletinTopicHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully create a bulletin topic with minimal input", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Test Topic",
      category: { id: "10", name: "General" },
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      categoryId: "10",
    };

    const result = await createBulletinTopicHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics",
      JSON.stringify({ categoryId: "10" }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should successfully create a bulletin topic with all fields", async () => {
    const mockApiResponse = {
      id: "2",
      subject: "Full Topic",
      body: "<p>Hello</p>",
      isHtmlBody: true,
      category: { id: "10", name: "General" },
      acknowledgement: true,
      allowComments: true,
      operatorType: "SELECT_USERS",
      operators: [{ id: "5", name: "Admin" }],
      attachments: [
        { id: "100", name: "file.txt", contentType: "text/plain", size: "42" },
      ],
      publicPeriod: { isUnlimited: false, start: "2024-01-01T00:00:00Z" },
      isDraft: false,
      mentions: [{ id: "3", type: "USER" }],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      categoryId: "10",
      subject: "Full Topic",
      body: "<p>Hello</p>",
      isHtmlBody: true,
      manuallySender: { id: "1" },
      acknowledgement: true,
      allowComments: true,
      operatorType: "SELECT_USERS" as const,
      operators: [{ id: "5" }],
      attachments: [{ name: "file.txt", content: "dGVzdA==" }],
      publicPeriod: { isUnlimited: false, start: "2024-01-01T00:00:00Z" },
      isDraft: false,
      mentions: [{ id: "3", type: "USER" }],
    };

    const result = await createBulletinTopicHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics",
      JSON.stringify({
        categoryId: "10",
        subject: "Full Topic",
        body: "<p>Hello</p>",
        isHtmlBody: true,
        manuallySender: { id: "1" },
        acknowledgement: true,
        allowComments: true,
        operatorType: "SELECT_USERS",
        operators: [{ id: "5" }],
        attachments: [{ name: "file.txt", content: "dGVzdA==" }],
        publicPeriod: { isUnlimited: false, start: "2024-01-01T00:00:00Z" },
        isDraft: false,
        mentions: [{ id: "3", type: "USER" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should create a draft topic", async () => {
    const mockApiResponse = {
      id: "3",
      subject: "Draft Topic",
      isDraft: true,
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      categoryId: "10",
      subject: "Draft Topic",
      isDraft: true,
    };

    const result = await createBulletinTopicHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics",
      JSON.stringify({
        categoryId: "10",
        subject: "Draft Topic",
        isDraft: true,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.isDraft).toBe(true);
  });
});
