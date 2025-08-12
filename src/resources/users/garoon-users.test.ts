import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { garoonUsersResource as resource } from "./garoon-users.js";
import * as client from "../../client.js";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual("../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("garoon-users resource", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("resource configuration", () => {
    it("should have correct name", () => {
      expect(resource.name).toBe("garoon-users");
    });

    it("should have correct description", () => {
      expect(resource.config.description).toContain(
        'Get "user id", "user name", and "user code" mapping',
      );
    });

    it("should have correct mimeType", () => {
      expect(resource.config.mimeType).toBe("application/json");
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

      const uri = new URL("garoon-users://John");
      const result = await resource.callback(uri, { name: "John" }, {} as any);

      expect(mockGetRequest).toHaveBeenCalledWith(
        "/api/v1/base/users?name=John",
      );

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe(uri.href);
      expect(result.contents[0].mimeType).toBe("application/json");
      expect(JSON.parse(result.contents[0].text as string)).toEqual(
        expectedResult,
      );
    });

    it("should handle array name parameter", async () => {
      const mockApiResponse = {
        users: [],
        hasNext: false,
      };

      mockGetRequest.mockResolvedValue(mockApiResponse);

      const uri = new URL("garoon-users://test");
      const result = await resource.callback(
        uri,
        { name: ["test", "other"] },
        {} as any,
      );

      expect(mockGetRequest).toHaveBeenCalledWith(
        "/api/v1/base/users?name=test",
      );
      expect(result.contents).toHaveLength(1);
    });
  });
});
