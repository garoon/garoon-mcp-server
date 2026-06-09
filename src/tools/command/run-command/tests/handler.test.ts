import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runCommandHandler } from "../handler.js";
import * as internalClient from "../../../../internal-client.js";

vi.mock("../../../../internal-client.js", async () => {
  const actual = await vi.importActual("../../../../internal-client.js");
  return {
    ...actual,
    executeCommand: vi.fn(),
  };
});

describe("runCommandHandler", () => {
  const mockExecuteCommand = vi.mocked(internalClient.executeCommand);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should execute a command with params", async () => {
    mockExecuteCommand.mockResolvedValue({
      statusCode: 200,
      responseBody: '{"url":"/g/schedule/index"}',
    });

    const result = await runCommandHandler(
      {
        endpoint: "schedule/command_delete.csp",
        params: { event: "40", apply: "all" },
      },
      {} as any,
    );

    expect(mockExecuteCommand).toHaveBeenCalledWith(
      "schedule/command_delete.csp",
      { event: "40", apply: "all" },
    );

    const expectedResult = {
      result: {
        statusCode: 200,
        responseBody: '{"url":"/g/schedule/index"}',
      },
    };

    expect(JSON.parse(result.content[0].text as string)).toEqual(
      expectedResult,
    );
    expect(result.structuredContent).toEqual(expectedResult);
  });

  it("should execute a command without params", async () => {
    mockExecuteCommand.mockResolvedValue({
      statusCode: 200,
      responseBody: "OK",
    });

    const result = await runCommandHandler(
      { endpoint: "some/command.csp" },
      {} as any,
    );

    expect(mockExecuteCommand).toHaveBeenCalledWith("some/command.csp", {});

    expect(result.structuredContent).toEqual({
      result: { statusCode: 200, responseBody: "OK" },
    });
  });

  it("should return error status codes", async () => {
    mockExecuteCommand.mockResolvedValue({
      statusCode: 404,
      responseBody: "Not Found",
    });

    const result = await runCommandHandler(
      { endpoint: "missing/command.csp", params: {} },
      {} as any,
    );

    expect(result.structuredContent).toEqual({
      result: { statusCode: 404, responseBody: "Not Found" },
    });
  });
});
