import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSpacesHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getSpacesHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get spaces with no parameters", async () => {
    const mockApiResponse = {
      spaces: [
        {
          id: "1",
          name: "Test Space",
          isPublic: true,
        },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: mockApiResponse,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    const result = await getSpacesHandler({}, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/space/spaces?");

    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should get spaces with limit and offset", async () => {
    const mockApiResponse = {
      spaces: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getSpacesHandler({ limit: 50, offset: 10 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/space/spaces?limit=50&offset=10",
    );
  });
});
