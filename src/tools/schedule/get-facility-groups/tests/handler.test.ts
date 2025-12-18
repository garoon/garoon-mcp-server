import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getFacilityGroupsHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getFacilityGroupsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get facility groups without parameters", async () => {
    const mockApiResponse = {
      facilityGroups: [
        {
          id: "1",
          name: "name1",
          code: "code",
          notes: "memo",
          parentFacilityGroup: "2",
          childFacilityGroups: [{ id: "10" }],
        },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        facilityGroups: [
          {
            id: "1",
            name: "name1",
            code: "code",
            notes: "memo",
            parentFacilityGroup: "2",
            childFacilityGroups: [{ id: "10" }],
          },
        ],
        hasNext: false,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getFacilityGroupsHandler({}, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilityGroups?",
    );

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should successfully get facility groups with limit", async () => {
    const mockApiResponse = {
      facilityGroups: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilityGroupsHandler({ limit: 30 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilityGroups?limit=30",
    );
  });

  it("should successfully get facility groups with offset", async () => {
    const mockApiResponse = {
      facilityGroups: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilityGroupsHandler({ offset: 10 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilityGroups?offset=10",
    );
  });

  it("should successfully get facility groups with all parameters", async () => {
    const mockApiResponse = {
      facilityGroups: [],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilityGroupsHandler({ limit: 30, offset: 60 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilityGroups?limit=30&offset=60",
    );
  });

  it("should handle zero limit and offset values by omitting them", async () => {
    const mockApiResponse = {
      facilityGroups: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilityGroupsHandler({ limit: 0, offset: 0 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilityGroups?",
    );
  });
});
