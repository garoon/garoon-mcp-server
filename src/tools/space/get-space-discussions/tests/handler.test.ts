import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSpaceDiscussionsHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getSpaceDiscussionsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get discussions with spaceId only", async () => {
    const mockApiResponse = {
      discussions: [
        {
          id: "1",
          title: "Test Discussion",
          body: "Discussion body",
          isHtmlBody: false,
        },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: mockApiResponse,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    const result = await getSpaceDiscussionsHandler(
      { spaceId: "5" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/space/5/discussions?");

    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should get discussions with all parameters", async () => {
    const mockApiResponse = {
      discussions: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getSpaceDiscussionsHandler(
      { spaceId: "5", limit: 50, offset: 10 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/space/5/discussions?limit=50&offset=10",
    );
  });
});
