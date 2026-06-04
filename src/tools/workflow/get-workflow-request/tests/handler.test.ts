import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getWorkflowRequestHandler } from "../handler.js";
import * as client from "../../../../client.js";

vi.mock("../../../../client.js", async () => {
  const actual = await vi.importActual("../../../../client.js");
  return {
    ...actual,
    getRequest: vi.fn(),
  };
});

describe("getWorkflowRequestHandler", () => {
  const mockGetRequest = vi.mocked(client.getRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get a workflow request by requestId", async () => {
    const mockApiResponse = {
      id: "1",
      status: { name: "Approved", type: "approved" },
      createdAt: "2024-01-01T00:00:00Z",
      processingStepCode: "step1",
      name: "Leave Request",
      number: "REQ-001",
      isUrgent: false,
      applicant: {
        id: "10",
        code: "user1",
        name: "Test User",
        form: { id: "100", name: "Leave Form" },
      },
      items: {},
      steps: {},
    };

    const expectedResult = {
      result: {
        request: mockApiResponse,
      },
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    const result = await getWorkflowRequestHandler(
      { requestId: "1" },
      {} as any,
    );

    expect(mockGetRequest).toHaveBeenCalledWith("/api/v1/workflow/requests/1");

    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should encode requestId in the URL", async () => {
    const mockApiResponse = {
      id: "1",
      status: { name: "Approved", type: "approved" },
      createdAt: "2024-01-01T00:00:00Z",
      processingStepCode: "step1",
      name: "Leave Request",
      number: "REQ-001",
      isUrgent: false,
      applicant: {
        id: "10",
        code: "user1",
        name: "Test User",
        form: { id: "100", name: "Leave Form" },
      },
      items: {},
      steps: {},
    };

    mockGetRequest.mockResolvedValue(mockApiResponse as any);

    await getWorkflowRequestHandler({ requestId: "1/2" }, {} as any);

    expect(mockGetRequest).toHaveBeenCalledWith(
      "/api/v1/workflow/requests/1%2F2",
    );
  });
});
