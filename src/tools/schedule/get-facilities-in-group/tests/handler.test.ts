import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getFacilitiesInGroupHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getFacilitiesInGroupHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get facilities in group with facilityGroupId only", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "5",
          name: "Room A",
          code: "roa",
          notes: "memo",
          facilityGroup: "1",
        },
      ],
    };

    const expectedResult = {
      result: {
        facilities: [
          {
            id: "5",
            name: "Room A",
            code: "roa",
            notes: "memo",
            facilityGroup: "1",
          },
        ],
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    const result = await getFacilitiesInGroupHandler(
      { facilityGroupId: "1" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilityGroups/1/facilities?",
    );

    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should get facilities in group with all parameters", async () => {
    const mockApiResponse = {
      facilities: [],
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilitiesInGroupHandler(
      { facilityGroupId: "1", limit: 5, offset: 10 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilityGroups/1/facilities?limit=5&offset=10",
    );
  });
});
