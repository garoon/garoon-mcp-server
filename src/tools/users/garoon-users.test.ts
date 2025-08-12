import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { garoonUsersTool as tool } from "./garoon-users.js";
import * as client from "../../client.js";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual("../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("garoon-users tool", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("tool configuration", () => {
    it("should have correct name", () => {
      expect(tool.name).toBe("get-garoon-users");
    });

    it("should have correct description", () => {
      expect(tool.config.description).toBe(
        "Get User's name, ID, and code data mapping in Garoon by searching a user name or a user code.",
      );
    });

    it("should have correct title", () => {
      expect(tool.config.title).toBe("Get Garoon User Data Mapping");
    });
  });

  describe("callback function", () => {
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
        isError: false,
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

      const result = await tool.callback({ name: "John" }, {} as any);

      expect(mockGetRequest).toHaveBeenCalledWith(
        "/api/v1/base/users?name=John",
      );

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

      await tool.callback({ name: "田中太郎" }, {} as any);

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
        isError: false,
        result: {
          users: [],
        },
      };

      mockGetRequest.mockResolvedValue(mockApiResponse);

      const result = await tool.callback({ name: "nonexistent" }, {} as any);

      expect(result.content).toHaveLength(1);
      expect(JSON.parse(result.content[0].text as string)).toEqual(
        expectedResult,
      );
    });
  });
});
