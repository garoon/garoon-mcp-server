import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updatePresenceByCodeHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    patchRequest: vi.fn(),
  };
});

describe("updatePresenceByCodeHandler", () => {
  const mockPatchRequest = vi.mocked(client.patchRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should update presence with status and notes", async () => {
    const mockApiResponse = {
      user: { id: "1", code: "jiro_suzuki", name: "Jiro Suzuki" },
      updatedAt: "2024-01-01T00:00:00+09:00",
      notes: "In a meeting",
      status: { name: "Attending", code: "attend" },
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse as any);

    const result = await updatePresenceByCodeHandler(
      {
        loginName: "jiro_suzuki",
        status: { code: "attend" },
        notes: "In a meeting",
      },
      {} as any,
    );

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/code/jiro_suzuki",
      JSON.stringify({
        status: { code: "attend" },
        notes: "In a meeting",
      }),
    );

    const expectedResult = {
      result: { presence: mockApiResponse },
    };

    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should update presence with status only", async () => {
    const mockApiResponse = {
      user: { id: "1", code: "jiro_suzuki", name: "Jiro Suzuki" },
      updatedAt: "2024-01-01T00:00:00+09:00",
      notes: "",
      status: { name: "Absence", code: "absence" },
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse as any);

    await updatePresenceByCodeHandler(
      {
        loginName: "jiro_suzuki",
        status: { code: "absence" },
      },
      {} as any,
    );

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/code/jiro_suzuki",
      JSON.stringify({
        status: { code: "absence" },
      }),
    );
  });

  it("should encode loginName in URL", async () => {
    const mockApiResponse = {
      user: { id: "2", code: "user@domain", name: "User Domain" },
      updatedAt: "2024-01-01T00:00:00+09:00",
      notes: "Out of office",
      status: { name: "Absence", code: "absence" },
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse as any);

    await updatePresenceByCodeHandler(
      {
        loginName: "user@domain",
        notes: "Out of office",
      },
      {} as any,
    );

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/code/user%40domain",
      JSON.stringify({
        notes: "Out of office",
      }),
    );
  });
});
