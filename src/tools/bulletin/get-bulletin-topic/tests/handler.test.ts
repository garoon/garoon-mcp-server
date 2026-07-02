import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBulletinTopicHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getBulletinTopicHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get topic detail by topicId", async () => {
    const mockApiResponse = {
      id: "1",
      subject: "Important Notice",
      body: "<p>Hello</p>",
      isHtmlBody: true,
      creator: { id: "10", code: "taro", name: "Taro" },
      updater: { id: "10", code: "taro", name: "Taro" },
      createdAt: "2024-07-27T11:00:00+09:00",
      updatedAt: "2024-07-27T11:00:00+09:00",
      acknowledgement: false,
      allowComments: true,
      operatorType: "ONLY_SENDER",
      operators: [],
      attachments: [],
      publicPeriod: { isUnlimited: true },
      isDraft: false,
      isPublished: true,
      isExpired: false,
      category: { id: "5", name: "General" },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getBulletinTopicHandler({ topicId: "1" });

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/bulletin/topics/1");

    expect(result.topic).toEqual(mockApiResponse);
  });

  it("should encode topicId in URL", async () => {
    const mockApiResponse = {
      id: "200",
      subject: "Test",
      body: "body",
      isHtmlBody: false,
      creator: { id: "10", code: "taro", name: "Taro" },
      updater: { id: "10", code: "taro", name: "Taro" },
      createdAt: "2024-07-27T11:00:00+09:00",
      updatedAt: "2024-07-27T11:00:00+09:00",
      acknowledgement: false,
      allowComments: false,
      operatorType: "SELECT_USERS",
      operators: [{ id: "20", code: "jiro", name: "Jiro" }],
      attachments: [],
      publicPeriod: { isUnlimited: true },
      isDraft: false,
      isPublished: true,
      isExpired: false,
      category: { id: "3", name: "HR" },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getBulletinTopicHandler({ topicId: "200" });

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/bulletin/topics/200");
  });
});
