import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createMessageHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("createMessageHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully create a message with minimal input", async () => {
    const mockApiResponse = {
      id: "100",
      title: "Test Message",
      acknowledgement: false,
      creator: { id: "1", code: "user1", name: "User One" },
      updater: { id: "1", code: "user1", name: "User One" },
      createdAt: "2024-07-27T11:00:00+09:00",
      updatedAt: null,
      recipients: [
        {
          id: "2",
          name: "User Two",
          code: "user2",
          type: "USER",
          isAcknowledged: false,
        },
      ],
      isDraft: false,
      body: "",
      isHtmlBody: false,
      folders: [{ id: "1", name: "Sent", type: "SENT" }],
      operatorType: "ONLY_SENDER",
      operators: [],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      title: "Test Message",
      recipients: [{ id: "2", type: "USER" as const }],
    };

    const result = await createMessageHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/message/messages",
      JSON.stringify({
        title: "Test Message",
        recipients: [{ id: "2", type: "USER" }],
      }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should successfully create a message with all fields", async () => {
    const mockApiResponse = {
      id: "200",
      title: "Full Message",
      acknowledgement: true,
      creator: { id: "1", code: "user1", name: "User One" },
      updater: { id: "1", code: "user1", name: "User One" },
      createdAt: "2024-07-27T11:00:00+09:00",
      updatedAt: null,
      recipients: [
        {
          id: "2",
          name: "User Two",
          code: "user2",
          type: "USER",
          isAcknowledged: false,
        },
        {
          id: "3",
          name: "User Three",
          code: "user3",
          type: "USER",
          isAcknowledged: false,
        },
      ],
      isDraft: false,
      body: "<p>Hello everyone</p>",
      isHtmlBody: true,
      folders: [{ id: "1", name: "Sent", type: "SENT" }],
      operatorType: "SELECT_USERS",
      operators: [{ id: "2", name: "User Two", code: "user2", type: "USER" }],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      title: "Full Message",
      recipients: [
        { id: "2", type: "USER" as const },
        { id: "3", type: "USER" as const },
      ],
      acknowledgement: true,
      isDraft: false,
      body: "<p>Hello everyone</p>",
      isHtmlBody: true,
      operatorType: "SELECT_USERS" as const,
      operators: [{ id: "2", code: "user2", type: "USER" as const }],
    };

    const result = await createMessageHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/message/messages",
      JSON.stringify({
        title: "Full Message",
        recipients: [
          { id: "2", type: "USER" },
          { id: "3", type: "USER" },
        ],
        acknowledgement: true,
        isDraft: false,
        body: "<p>Hello everyone</p>",
        isHtmlBody: true,
        operatorType: "SELECT_USERS",
        operators: [{ id: "2", code: "user2", type: "USER" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should create a draft message", async () => {
    const mockApiResponse = {
      id: "300",
      title: "Draft Message",
      acknowledgement: false,
      creator: { id: "1", code: "user1", name: "User One" },
      updater: { id: "1", code: "user1", name: "User One" },
      createdAt: "2024-07-27T11:00:00+09:00",
      updatedAt: null,
      recipients: [
        {
          id: "2",
          name: "User Two",
          code: "user2",
          type: "USER",
          isAcknowledged: false,
        },
      ],
      isDraft: true,
      body: "Draft content",
      isHtmlBody: false,
      folders: [{ id: "5", name: "Drafts", type: "DRAFT" }],
      operatorType: "ONLY_SENDER",
      operators: [],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      title: "Draft Message",
      recipients: [{ id: "2", type: "USER" as const }],
      isDraft: true,
      body: "Draft content",
    };

    const result = await createMessageHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/message/messages",
      JSON.stringify({
        title: "Draft Message",
        recipients: [{ id: "2", type: "USER" }],
        isDraft: true,
        body: "Draft content",
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should create a message with operators without code", async () => {
    const mockApiResponse = {
      id: "400",
      title: "Operator Message",
      acknowledgement: false,
      creator: { id: "1", code: "user1", name: "User One" },
      updater: { id: "1", code: "user1", name: "User One" },
      createdAt: "2024-07-27T11:00:00+09:00",
      updatedAt: null,
      recipients: [
        {
          id: "2",
          name: "User Two",
          code: "user2",
          type: "USER",
          isAcknowledged: false,
        },
      ],
      isDraft: false,
      body: "",
      isHtmlBody: false,
      folders: [],
      operatorType: "SELECT_USERS",
      operators: [{ id: "2", name: "User Two", code: "user2", type: "USER" }],
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      title: "Operator Message",
      recipients: [{ id: "2", type: "USER" as const }],
      operatorType: "SELECT_USERS" as const,
      operators: [{ id: "2", type: "USER" as const }],
    };

    const result = await createMessageHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/message/messages",
      JSON.stringify({
        title: "Operator Message",
        recipients: [{ id: "2", type: "USER" }],
        operatorType: "SELECT_USERS",
        operators: [{ id: "2", type: "USER" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
