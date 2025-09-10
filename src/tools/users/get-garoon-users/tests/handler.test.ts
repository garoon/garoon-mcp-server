import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getGaroonUsersHandler } from "../handler.js";
import * as client from "../../../../client.js";

// Mock the client module
vi.mock("../../../../client.js", () => ({
  getRequest: vi.fn(),
}));

describe("getGaroonUsersHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get users data", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "123",
          name: "John",
          code: "user01",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "John" });

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/base/users?name=John");

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.isError).toBe(false);
    expect(parsedResult.result).toEqual(mockApiResponse);
  });

  it("should handle encoded special characters in name", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "456",
          name: "田中太郎",
          code: "t-tanaka",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getGaroonUsersHandler({ name: "田中太郎" });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=%E7%94%B0%E4%B8%AD%E5%A4%AA%E9%83%8E",
    );
  });

  it("should handle empty results", async () => {
    const mockApiResponse = {
      users: [],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "nonexistent" });

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.isError).toBe(false);
    expect(parsedResult.result.users).toEqual([]);
  });

  it("should handle multiple users", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "1",
          name: "John Doe",
          code: "john.doe",
        },
        {
          id: "2",
          name: "Jane Smith",
          code: "jane.smith",
        },
        {
          id: "3",
          name: "Bob Johnson",
          code: "bob.johnson",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "John" });

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users).toHaveLength(3);
    expect(parsedResult.result.users[0].name).toBe("John Doe");
  });

  it("should handle user code search", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "789",
          name: "Alice Brown",
          code: "alice.brown",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "alice.brown" });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=alice.brown",
    );

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users[0].code).toBe("alice.brown");
  });

  it("should handle special characters in user code", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "999",
          name: "Test User",
          code: "user@domain.com",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getGaroonUsersHandler({ name: "user@domain.com" });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=user%40domain.com",
    );
  });

  it("should handle spaces in name", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "555",
          name: "Mary Jane Watson",
          code: "mary.jane",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getGaroonUsersHandler({ name: "Mary Jane Watson" });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=Mary%20Jane%20Watson",
    );
  });

  it("should return structured content", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "123",
          name: "Test User",
          code: "test.user",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "Test User" });

    expect(result.structuredContent).toBeDefined();
    if (result.structuredContent) {
      expect(result.structuredContent.isError).toBe(false);
      expect((result.structuredContent.result as any).users).toHaveLength(1);
      expect((result.structuredContent.result as any).users[0].name).toBe(
        "Test User",
      );
    }
  });

  it("should validate output schema", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "123",
          name: "Test User",
          code: "test.user",
        },
      ],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "Test User" });

    // The handler should validate the output and not throw
    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
  });

  it("should handle empty string name", async () => {
    const mockApiResponse = {
      users: [],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "" });

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/base/users?name=");

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.isError).toBe(false);
  });
});
