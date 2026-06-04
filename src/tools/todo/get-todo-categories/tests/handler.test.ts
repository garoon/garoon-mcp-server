import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getTodoCategoriesHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getTodoCategoriesHandler", () => {
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
        { id: 1, name: "Work" },
        { id: 2, name: "Personal" },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: mockApiResponse,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getTodoCategoriesHandler({}, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/todo/categories?");

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should successfully get categories with limit", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getTodoCategoriesHandler({ limit: 50 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/todo/categories?limit=50",
    );
  });

  it("should successfully get categories with offset", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getTodoCategoriesHandler({ offset: 20 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/todo/categories?offset=20",
    );
  });

  it("should successfully get categories with all parameters", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getTodoCategoriesHandler({ limit: 50, offset: 100 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/todo/categories?limit=50&offset=100",
    );
  });

  it("should handle zero limit and offset values by omitting them", async () => {
    const mockApiResponse = {
      categories: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getTodoCategoriesHandler({ limit: 0, offset: 0 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/todo/categories?");
  });
});
