import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getMessageHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getMessageHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get a message by ID", async () => {
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
      body: "Hello, this is a test message.",
      isHtmlBody: false,
      folders: [{ id: "1", name: "Inbox", type: "INBOX" }],
      operatorType: "ONLY_SENDER",
      operators: [],
    };

    const expectedResult = {
      result: mockApiResponse,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getMessageHandler({ messageId: "100" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/message/messages/100");

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should successfully get a message with acknowledgement and HTML body", async () => {
    const mockApiResponse = {
      id: "200",
      title: "HTML Message",
      acknowledgement: true,
      creator: { id: "1", code: "admin", name: "Admin" },
      updater: { id: "2", code: "editor", name: "Editor" },
      createdAt: "2024-07-27T11:00:00+09:00",
      updatedAt: "2024-07-28T10:00:00+09:00",
      recipients: [
        {
          id: "3",
          name: "User Three",
          code: "user3",
          type: "USER",
          isAcknowledged: true,
        },
        {
          id: "4",
          name: "User Four",
          code: "user4",
          type: "USER",
          isAcknowledged: false,
        },
      ],
      isDraft: false,
      body: "<p>Hello</p>",
      isHtmlBody: true,
      folders: [{ id: "1", name: "Sent", type: "SENT" }],
      operatorType: "ALL_TO_RECIPIENTS",
      operators: [{ id: "3", name: "User Three", code: "user3", type: "USER" }],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getMessageHandler({ messageId: "200" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/message/messages/200");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
