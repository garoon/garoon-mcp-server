import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTodoHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("createTodoHandler", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully create a TODO with minimal input", async () => {
    const mockApiResponse = {
      id: 1,
      status: "Uncompleted",
      category: 0,
      subject: "Test TODO",
      hasDueDate: false,
      priority: 2,
      notes: "",
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "Test TODO",
    };

    const result = await createTodoHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/todo/todos",
      JSON.stringify({
        subject: "Test TODO",
      }),
    );

    expect(result).toHaveProperty("structuredContent");
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should successfully create a TODO with all fields", async () => {
    const mockApiResponse = {
      id: 2,
      status: "Uncompleted",
      category: 10,
      subject: "Full TODO",
      hasDueDate: true,
      dueDate: "2024-12-31T23:59:59+09:00",
      priority: 1,
      notes: "Important notes",
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "Full TODO",
      category: 10,
      dueDate: "2024-12-31T23:59:59+09:00",
      priority: 1,
      notes: "Important notes",
    };

    const result = await createTodoHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/todo/todos",
      JSON.stringify({
        subject: "Full TODO",
        category: 10,
        dueDate: "2024-12-31T23:59:59+09:00",
        priority: 1,
        notes: "Important notes",
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });

  it("should handle category 0 by including it in request", async () => {
    const mockApiResponse = {
      id: 3,
      status: "Uncompleted",
      category: 0,
      subject: "Category Zero TODO",
      hasDueDate: false,
      priority: 2,
      notes: "",
    };

    mockPostRequest.mockResolvedValue(mockApiResponse);

    const input = {
      subject: "Category Zero TODO",
      category: 0,
    };

    const result = await createTodoHandler(input, {} as any);

    expect(mockPostRequest).toHaveBeenCalledWith(
      "/api/v1/todo/todos",
      JSON.stringify({
        subject: "Category Zero TODO",
        category: 0,
      }),
    );

    const structuredContent = result.structuredContent as any;
    expect(structuredContent.result).toEqual(mockApiResponse);
  });
});
