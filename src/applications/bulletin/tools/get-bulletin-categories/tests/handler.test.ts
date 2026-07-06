import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBulletinCategoriesHandler } from "../handler.js";
import * as client from "../../../../../client.js";

vi.mock("../../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getBulletinCategoriesHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get categories without parameters", async () => {
    const mockApiResponse = {
      categories: [
        {
          id: "1",
          name: "General",
          description: "General announcements",
          hasSubCategories: true,
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getBulletinCategoriesHandler({});

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/bulletin/categories?");

    expect(result).toEqual(mockApiResponse);
  });

  it("should pass parentId parameter", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getBulletinCategoriesHandler({ parentId: 5 });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/categories?parentId=5",
    );
  });

  it("should pass negative parentId for special categories", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getBulletinCategoriesHandler({ parentId: -1 });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/categories?parentId=-1",
    );
  });

  it("should pass all parameters", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getBulletinCategoriesHandler({ parentId: 1, limit: 50, offset: 10 });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/categories?parentId=1&limit=50&offset=10",
    );
  });

  it("should handle zero limit and offset values by omitting them", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getBulletinCategoriesHandler({ limit: 0, offset: 0 });

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/bulletin/categories?");
  });
});
