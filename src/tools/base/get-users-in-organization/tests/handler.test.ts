import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as client from "../../../../client.js";
import { getUsersInOrganizationHandler } from "../handler.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getUsersInOrganizationHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get users in organization", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "123",
          name: "John Doe",
          code: "john.doe",
        },
      ],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        users: [
          {
            id: "123",
            name: "John Doe",
            code: "john.doe",
          },
        ],
        hasNext: false,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getUsersInOrganizationHandler(
      { organizationId: "123" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations/123/users",
    );

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should handle limit and offset parameters", async () => {
    const mockApiResponse = {
      users: [
        {
          id: "789",
          name: "Bob Wilson",
          code: "bob.wilson",
        },
      ],
      hasNext: true,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getUsersInOrganizationHandler(
      { organizationId: "123", limit: 10, offset: 20 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations/123/users?limit=10&offset=20",
    );
  });

  it("should handle only limit parameter", async () => {
    const mockApiResponse = {
      users: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getUsersInOrganizationHandler(
      { organizationId: "123", limit: 5 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations/123/users?limit=5",
    );
  });

  it("should handle only offset parameter", async () => {
    const mockApiResponse = {
      users: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getUsersInOrganizationHandler(
      { organizationId: "123", offset: 10 },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations/123/users?offset=10",
    );
  });

  it("should encode organizationId in URL", async () => {
    const mockApiResponse = {
      users: [],
      hasNext: false,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    await getUsersInOrganizationHandler(
      { organizationId: "special/chars#123" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/base/organizations/special%2Fchars%23123/users",
    );
  });

  it("should handle empty results", async () => {
    const mockApiResponse = {
      users: [],
      hasNext: false,
    };

    const expectedResult = {
      result: {
        users: [],
        hasNext: false,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getUsersInOrganizationHandler(
      { organizationId: "123" },
      {} as any,
    );

    expect(result.structuredContent).toEqual(expectedResult);
  });
});
