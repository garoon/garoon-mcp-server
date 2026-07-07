import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBulletinTopicsHandler } from "../handler.js";
import * as client from "#client.js";

vi.mock("#client.js", async () => {
  const actual = await vi.importActual("#client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getBulletinTopicsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get topics with categoryId only", async () => {
    const mockApiResponse = {
      topics: [
        {
          id: "1",
          subject: "Important Notice",
          updatedAt: "2024-07-27T11:00:00+09:00",
          updater: {
            id: "10",
            code: "taro_yamada",
            name: "Taro Yamada",
          },
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getBulletinTopicsHandler({ categoryId: "1" });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/categories/1?",
    );

    expect(result).toEqual(mockApiResponse);
  });

  it("should get topics with all parameters", async () => {
    const mockApiResponse = {
      topics: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getBulletinTopicsHandler({ categoryId: "5", limit: 20, offset: 10 });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/categories/5?limit=20&offset=10",
    );
  });

  it("should encode categoryId in URL", async () => {
    const mockApiResponse = {
      topics: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getBulletinTopicsHandler({ categoryId: "100" });

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/categories/100?",
    );
  });
});
