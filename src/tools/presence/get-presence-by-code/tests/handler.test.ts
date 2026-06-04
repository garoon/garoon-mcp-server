import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPresenceByCodeHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getPresenceByCodeHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get presence information by login name", async () => {
    const mockApiResponse = {
      user: { id: "1", code: "jiro_suzuki", name: "Jiro Suzuki" },
      updatedAt: "2024-01-01T00:00:00+09:00",
      notes: "Working from home",
      status: { name: "Attending", code: "attend" },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    const result = await getPresenceByCodeHandler(
      { loginName: "jiro_suzuki" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/code/jiro_suzuki",
    );

    const expectedResult = {
      result: { presence: mockApiResponse },
    };

    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should encode loginName in URL", async () => {
    const mockApiResponse = {
      user: { id: "2", code: "user@domain", name: "User Domain" },
      updatedAt: "2024-01-01T00:00:00+09:00",
      notes: "",
      status: { name: "Absence", code: "absence" },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    await getPresenceByCodeHandler({ loginName: "user@domain" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/code/user%40domain",
    );
  });
});
