import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getOrganizationsHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getOrganizationsHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get organizations data with name only", async () => {
    const mockApiResponse = {
      organizations: [
        {
          id: "123",
          name: "Sales Department",
          code: "sales",
        },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        organizations: [
          {
            id: "123",
            name: "Sales Department",
            code: "sales",
          },
        ],
        hasNext: false,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getOrganizationsHandler({ name: "Sales" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations?name=Sales",
    );

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should handle all parameters (name, limit, offset)", async () => {
    const mockApiResponse = {
      organizations: [
        {
          id: "456",
          name: "Engineering Department",
          code: "engineering",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getOrganizationsHandler(
      { name: "Eng", limit: 10, offset: 5 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations?name=Eng&limit=10&offset=5",
    );
  });

  it("should handle encoded special characters in organization name", async () => {
    const mockApiResponse = {
      organizations: [
        {
          id: "789",
          name: "営業部",
          code: "sales-jp",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getOrganizationsHandler({ name: "営業部" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations?name=%E5%96%B6%E6%A5%AD%E9%83%A8",
    );
  });

  it("should handle empty results", async () => {
    const mockApiResponse = {
      organizations: [],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        organizations: [],
        hasNext: false,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getOrganizationsHandler(
      { name: "nonexistent" },
      {} as any,
    );

    expect(result.content).toHaveLength(1);
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
  });

  it("should handle multiple organizations", async () => {
    const mockApiResponse = {
      organizations: [
        {
          id: "123",
          name: "Sales Department",
          code: "sales",
        },
        {
          id: "456",
          name: "Sales Support",
          code: "sales-support",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getOrganizationsHandler({ name: "Sales" }, {} as any);

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.organizations).toHaveLength(2);
    expect(parsedResult.result.organizations[0].name).toBe("Sales Department");
    expect(parsedResult.result.organizations[1].name).toBe("Sales Support");
    expect(parsedResult.result.hasNext).toBe(true);
  });

  it("should handle organizations with special characters in names", async () => {
    const mockApiResponse = {
      organizations: [
        {
          id: "101",
          name: "R&D Department",
          code: "rd",
        },
        {
          id: "102",
          name: "IT/Security Team",
          code: "it-security",
        },
      ],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getOrganizationsHandler({ name: "R&D" }, {} as any);

    expect(result.content).toHaveLength(1);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.result.organizations).toHaveLength(2);
    expect(parsedResult.result.organizations[0].name).toBe("R&D Department");
    expect(parsedResult.result.organizations[1].name).toBe("IT/Security Team");
  });
});
