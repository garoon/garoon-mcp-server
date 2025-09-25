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
        hasNext: false,
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
        hasNext: false,
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

  it("should handle limit parameter", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "123",
          name: "John Doe",
          code: "john.doe",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler(
      { name: "John", limit: 1 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=John&limit=1",
    );

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.hasNext).toBe(true);
  });

  it("should handle offset parameter", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "456",
          name: "Jane Smith",
          code: "jane smith",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler(
      { name: "Jane", offset: 10 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=Jane&offset=10",
    );

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users[0].name).toBe("Jane Smith");
  });

  it("should handle both limit and offset parameters", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "789",
          name: "Bob Wilson",
          code: "bob.wilson",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler(
      { name: "Bob", limit: 5, offset: 20 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=Bob&limit=5&offset=20",
    );

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users[0].name).toBe("Bob Wilson");
    expect(parsedResult.result.hasNext).toBe(true);
  });

  it("should handle pagination without name", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "111",
          name: "First User",
          code: "first.user",
        },
        {
          id: "222",
          name: "Second User",
          code: "second.user",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler(
      { limit: 2, offset: 0 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?limit=2&offset=0",
    );

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users).toHaveLength(2);
    expect(parsedResult.result.hasNext).toBe(true);
  });

  it("should handle when offset equals 0", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "333",
          name: "Zero Offset User",
          code: "zero.offset.user",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({ offset: 0 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/base/users?offset=0");

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users[0].name).toBe("Zero Offset User");
  });

  it("should use name from input when provided (searchName = name)", async () => {
    process.env.GAROON_USERNAME = "envuser";

    const mockApiResponse = {
      users: [
        {
          id: "123",
          name: "Input User",
          code: "input.user",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler(
      { name: "input.user" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=input.user",
    );

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users[0].name).toBe("Input User");
  });

  it("should fallback to GAROON_USERNAME when name not provided (searchName = process.env.GAROON_USERNAME)", async () => {
    process.env.GAROON_USERNAME = "env.fallback.user";

    const mockApiResponse = {
      users: [
        {
          id: "456",
          name: "Environment Fallback User",
          code: "env.fallback.user",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getGaroonUsersHandler({}, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/users?name=env.fallback.user",
    );

    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.users[0].name).toBe("Environment Fallback User");
  });
});
