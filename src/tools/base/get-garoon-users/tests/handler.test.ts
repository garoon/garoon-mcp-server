import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getGaroonUsersHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

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
      hasNext: false,
    };

    const expectedResult = {
      result: {
        users: [
          {
            id: "123",
            name: "John",
            code: "user01",
          },
        ],
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "John" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/base/users?name=John");

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
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
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getGaroonUsersHandler({ name: "田中太郎" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=%E7%94%B0%E4%B8%AD%E5%A4%AA%E9%83%8E",
    );
  });

  it("should handle empty results", async () => {
    const mockApiResponse = {
      users: [],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        users: [],
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler(
      { name: "nonexistent" },
      {} as any,
    );

    expect(result.content).toHaveLength(1);
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
  });

  it("should handle multiple users", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "123",
          name: "John Doe",
          code: "john.doe",
        },
        {
          id: "456",
          name: "Jane Smith",
          code: "jane.smith",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "John" }, {} as any);

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users).toHaveLength(2);
    expect(parsedResult.result.users[0].name).toBe("John Doe");
    expect(parsedResult.result.users[1].name).toBe("Jane Smith");
  });

  it("should handle users with special characters in names", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "789",
          name: "José María",
          code: "jose.maria",
        },
        {
          id: "101",
          name: "李小明",
          code: "li.xiaoming",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ name: "José" }, {} as any);

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users).toHaveLength(2);
    expect(parsedResult.result.users[0].name).toBe("José María");
    expect(parsedResult.result.users[1].name).toBe("李小明");
  });
});
