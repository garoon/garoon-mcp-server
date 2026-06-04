import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getTodoHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getTodoHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully get a TODO item by ID", async () => {
    const mockApiResponse = {
      id: 1,
      status: "Uncompleted",
      category: 10,
      subject: "Test TODO",
      hasDueDate: true,
      dueDate: "2024-12-31T23:59:59+09:00",
      priority: 2,
      notes: "Some notes",
    };

    const expectedResult = {
      result: mockApiResponse,
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getTodoHandler({ todoId: "1" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/todo/todos/1");

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should successfully get a completed TODO item", async () => {
    const mockApiResponse = {
      id: 2,
      status: "Completed",
      category: 5,
      subject: "Completed TODO",
      hasDueDate: false,
      priority: 1,
      notes: "",
    };

    mockGetRequest.mockResolvedValue(mockApiResponse);

    const result = await getTodoHandler({ todoId: "2" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/todo/todos/2");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
