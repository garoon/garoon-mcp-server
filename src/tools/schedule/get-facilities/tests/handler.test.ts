import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getFacilitiesHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getFacilitiesHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get facilities data with name only", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "123",
          code: "101",
          name: "Conference Room 1",
          notes: "Large conference room with projector",
        },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        facilities: [
          {
            id: "123",
            code: "101",
            name: "Conference Room 1",
            notes: "Large conference room with projector",
          },
        ],
        hasNext: false,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getFacilitiesHandler(
      { name: "Conference Room" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilities?name=Conference+Room",
    );

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should successfully get facilities data with name and limit", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "123",
          code: "101",
          name: "Conference Room 1",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilitiesHandler(
      { name: "Conference Room", limit: 10 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilities?name=Conference+Room&limit=10",
    );
  });

  it("should successfully get facilities data with name and offset", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "456",
          code: "102",
          name: "Meeting Room 2",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilitiesHandler({ name: "Meeting Room", offset: 5 }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilities?name=Meeting+Room&offset=5",
    );
  });

  it("should successfully get facilities data with all parameters", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "789",
          code: "103",
          name: "Training Room",
          notes: "Room for training sessions",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilitiesHandler(
      { name: "Training Room", limit: 20, offset: 10 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilities?name=Training+Room&limit=20&offset=10",
    );
  });

  it("should handle encoded special characters in name", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "456",
          code: "201",
          name: "会議室A",
          notes: "大型会議室",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilitiesHandler({ name: "会議室A" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilities?name=%E4%BC%9A%E8%AD%B0%E5%AE%A4A",
    );
  });

  it("should handle empty results", async () => {
    const mockApiResponse = {
      facilities: [],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        facilities: [],
        hasNext: false,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getFacilitiesHandler(
      { name: "nonexistent" },
      {} as any,
    );

    expect(result.content).toHaveLength(1);
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
  });

  it("should handle multiple facilities", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "123",
          code: "101",
          name: "Conference Room 1",
          notes: "Large conference room with projector",
        },
        {
          id: "456",
          code: "102",
          name: "Meeting Room 2",
          notes: "Small meeting room for 4 people",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getFacilitiesHandler({ name: "Room" }, {} as any);

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.facilities).toHaveLength(2);
    expect(parsedResult.result.facilities[0].name).toBe("Conference Room 1");
    expect(parsedResult.result.facilities[1].name).toBe("Meeting Room 2");
  });

  it("should handle facilities with special characters in names", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "789",
          code: "301",
          name: "Room-101 & Room-102",
          notes: "Combined rooms with divider",
        },
        {
          id: "101",
          code: "401",
          name: "Training Room (Large)",
          notes: "Room for training sessions",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getFacilitiesHandler({ name: "Room" }, {} as any);

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.facilities).toHaveLength(2);
    expect(parsedResult.result.facilities[0].name).toBe("Room-101 & Room-102");
    expect(parsedResult.result.facilities[1].name).toBe(
      "Training Room (Large)",
    );
  });

  it("should handle facilities without notes", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "123",
          code: "101",
          name: "Conference Room 1",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getFacilitiesHandler(
      { name: "Conference Room" },
      {} as any,
    );

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.facilities[0].name).toBe("Conference Room 1");
    expect(parsedResult.result.facilities[0].notes).toBeUndefined();
  });

  it("should handle hasNext true", async () => {
    const mockApiResponse = {
      facilities: [
        {
          id: "123",
          code: "101",
          name: "Conference Room 1",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getFacilitiesHandler(
      { name: "Conference Room" },
      {} as any,
    );

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.hasNext).toBe(true);
  });

  it("should handle zero limit and offset values", async () => {
    const mockApiResponse = {
      facilities: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilitiesHandler(
      { name: "Room", limit: 0, offset: 0 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilities?name=Room",
    );
  });

  it("should handle negative limit and offset values", async () => {
    const mockApiResponse = {
      facilities: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getFacilitiesHandler(
      { name: "Room", limit: -1, offset: -5 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/schedule/facilities?name=Room&limit=-1&offset=-5",
    );
  });
});
