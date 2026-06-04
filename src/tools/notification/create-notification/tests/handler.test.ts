import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createNotificationHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("createNotificationHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully create a notification with required fields", async () => {
    const mockApiResponse = {
      moduleId: "grn.custom",
      notificationKey: "key-123",
      creator: {
        id: "1",
        code: "admin",
        name: "Administrator",
      },
      createdAt: "2024-01-01T00:00:00+09:00",
      operation: "add",
      url: "https://example.com",
      title: "Test Notification",
      body: "This is a test",
      icon: "",
      isRead: false,
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      app: "myApp",
      notificationKey: "key-123",
      operation: "add" as const,
      url: "https://example.com",
      title: "Test Notification",
      body: "This is a test",
      destinations: [{ type: "USER" as const, id: 1 }],
    };

    const result = await createNotificationHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/notification/items",
      JSON.stringify({
        app: "myApp",
        notificationKey: "key-123",
        operation: "add",
        url: "https://example.com",
        title: "Test Notification",
        body: "This is a test",
        destinations: [{ type: "USER", id: 1 }],
      }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should successfully create a notification with icon", async () => {
    const mockApiResponse = {
      moduleId: "grn.custom",
      notificationKey: "key-456",
      creator: {
        id: "1",
        code: "admin",
        name: "Administrator",
      },
      createdAt: "2024-01-01T00:00:00+09:00",
      operation: "modify",
      url: "https://example.com/item/1",
      title: "Updated Item",
      body: "Item updated",
      icon: "https://example.com/icon.png",
      isRead: false,
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      app: "myApp",
      notificationKey: "key-456",
      operation: "modify" as const,
      url: "https://example.com/item/1",
      title: "Updated Item",
      body: "Item updated",
      icon: "https://example.com/icon.png",
      destinations: [
        { type: "USER" as const, id: 1 },
        { type: "USER" as const, code: "user2" },
      ],
    };

    const result = await createNotificationHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/notification/items",
      JSON.stringify({
        app: "myApp",
        notificationKey: "key-456",
        operation: "modify",
        url: "https://example.com/item/1",
        title: "Updated Item",
        body: "Item updated",
        icon: "https://example.com/icon.png",
        destinations: [
          { type: "USER", id: 1 },
          { type: "USER", code: "user2" },
        ],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should handle remove operation", async () => {
    const mockApiResponse = {
      moduleId: "grn.custom",
      notificationKey: "key-789",
      creator: {
        id: "1",
        code: "admin",
        name: "Administrator",
      },
      createdAt: "2024-01-01T00:00:00+09:00",
      operation: "remove",
      url: "https://example.com/item/1",
      title: "Removed Item",
      body: "Item has been removed",
      icon: "",
      isRead: false,
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      app: "myApp",
      notificationKey: "key-789",
      operation: "remove" as const,
      url: "https://example.com/item/1",
      title: "Removed Item",
      body: "Item has been removed",
      destinations: [{ type: "USER" as const, code: "user1" }],
    };

    const result = await createNotificationHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/notification/items",
      JSON.stringify({
        app: "myApp",
        notificationKey: "key-789",
        operation: "remove",
        url: "https://example.com/item/1",
        title: "Removed Item",
        body: "Item has been removed",
        destinations: [{ type: "USER", code: "user1" }],
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
