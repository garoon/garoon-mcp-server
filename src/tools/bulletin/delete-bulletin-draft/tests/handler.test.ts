import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deleteBulletinDraftHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    deleteRequest: vi.fn(),
  };
});

describe("deleteBulletinDraftHandler", () => {
  const mockDeleteRequest = vi.mocked(client.deleteRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully delete a bulletin draft", async () => {
    mockDeleteRequest.mockResolvedValue(undefined);

    const input = {
      topicId: "1",
    };

    const result = await deleteBulletinDraftHandler(input, {} as any);

    expect(mockDeleteRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/draft/1",
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result.success).toBe(true);
  });

  it("should use correct endpoint with topic ID", async () => {
    mockDeleteRequest.mockResolvedValue(undefined);

    const input = {
      topicId: "999",
    };

    await deleteBulletinDraftHandler(input, {} as any);

    expect(mockDeleteRequest).toHaveBeenCalledWith(
      "/api/v1/bulletin/topics/draft/999",
    );
  });
});
