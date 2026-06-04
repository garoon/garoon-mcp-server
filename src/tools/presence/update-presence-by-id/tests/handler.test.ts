import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updatePresenceByIdHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    patchRequest: vi.fn(),
  };
});

describe("updatePresenceByIdHandler", () => {
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

    const result = await updatePresenceByIdHandler(
      {
        userId: "1",
        status: { code: "attend" },
        notes: "In a meeting",
      },
      {} as any,
    );

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/1",
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

    await updatePresenceByIdHandler(
      {
        userId: "1",
        status: { code: "absence" },
      },
      {} as any,
    );

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/1",
      JSON.stringify({
        status: { code: "absence" },
      }),
    );
  });

  it("should update presence with notes only", async () => {
    const mockApiResponse = {
      user: { id: "1", code: "jiro_suzuki", name: "Jiro Suzuki" },
      updatedAt: "2024-01-01T00:00:00+09:00",
      notes: "Working remotely",
      status: { name: "Attending", code: "attend" },
    };

    mockPatchRequest.mockResolvedValue(mockApiResponse as any);

    await updatePresenceByIdHandler(
      {
        userId: "1",
        notes: "Working remotely",
      },
      {} as any,
    );

    expect(mockPatchRequest).toHaveBeenCalledWith(
      "/api/v1/presence/users/1",
      JSON.stringify({
        notes: "Working remotely",
      }),
    );
  });
});
