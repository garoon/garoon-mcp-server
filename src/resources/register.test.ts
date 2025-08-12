import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createResource } from "./register.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("createResource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should catch errors in static resource callback", async () => {
    const mockCallback = vi.fn().mockImplementation(() => {
      throw new Error("Test error");
    });

    const resource = createResource(
      "test-resource",
      "test://resource",
      {
        title: "Test Resource",
        description: "A resource for testing error handling",
      },
      mockCallback,
    );

    const mockUri = new URL("test://resource");
    const mockExtra = {} as any;
    const result = await resource.callback(mockUri, mockExtra);

    expect(result).toEqual({
      contents: [
        {
          uri: "test://resource",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              isError: true,
              error: "Test error",
            },
            null,
            2,
          ),
        },
      ],
    });
    expect(mockCallback).toHaveBeenCalledWith(mockUri, mockExtra);
  });

  it("should catch errors in template resource callback", async () => {
    const mockCallback = vi.fn().mockImplementation(() => {
      throw new Error("Template error");
    });

    const template = new ResourceTemplate("test://template/{id}", {
      list: undefined,
    });

    const resource = createResource(
      "template-resource",
      template,
      {
        title: "Template Resource",
        description: "A template resource for testing",
      },
      mockCallback,
    );

    const mockUri = new URL("test://template/123");
    const mockVariables = { id: "123" };
    const mockExtra = {} as any;
    const result = await resource.callback(mockUri, mockVariables, mockExtra);

    expect(result).toEqual({
      contents: [
        {
          uri: "test://template/123",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              isError: true,
              error: "Template error",
            },
            null,
            2,
          ),
        },
      ],
    });
    expect(mockCallback).toHaveBeenCalledWith(
      mockUri,
      mockVariables,
      mockExtra,
    );
  });

  it("should return successful result when static resource callback doesn't throw", async () => {
    const expectedResult = {
      contents: [
        {
          uri: "test://success",
          mimeType: "text/plain",
          text: "success data",
        },
      ],
    };
    const mockCallback = vi.fn().mockResolvedValue(expectedResult);

    const resource = createResource(
      "success-resource",
      "test://success",
      {
        title: "Success Resource",
        description: "A resource that succeeds",
      },
      mockCallback,
    );

    const mockUri = new URL("test://success");
    const mockExtra = {} as any;
    const result = await resource.callback(mockUri, mockExtra);

    expect(result).toEqual(expectedResult);
    expect(mockCallback).toHaveBeenCalledWith(mockUri, mockExtra);
  });

  it("should return successful result when template resource callback doesn't throw", async () => {
    const expectedResult = {
      contents: [
        {
          uri: "test://template/456",
          mimeType: "application/json",
          text: JSON.stringify({ id: "456", data: "template data" }),
        },
      ],
    };
    const mockCallback = vi.fn().mockResolvedValue(expectedResult);

    const template = new ResourceTemplate("test://template/{id}", {
      list: undefined,
    });

    const resource = createResource(
      "template-success",
      template,
      {
        title: "Template Success",
        description: "A template resource that succeeds",
      },
      mockCallback,
    );

    const mockUri = new URL("test://template/456");
    const mockVariables = { id: "456" };
    const mockExtra = {} as any;
    const result = await resource.callback(mockUri, mockVariables, mockExtra);

    expect(result).toEqual(expectedResult);
    expect(mockCallback).toHaveBeenCalledWith(
      mockUri,
      mockVariables,
      mockExtra,
    );
  });

  it("should create static resource with correct name and config", () => {
    const mockCallback = vi.fn();
    const config = {
      title: "Test Resource",
      description: "A test resource",
      mimeType: "text/plain",
    };

    const resource = createResource(
      "test-resource",
      "test://resource",
      config,
      mockCallback,
    );

    expect(resource.name).toBe("test-resource");
    expect(resource.uriOrTemplate).toBe("test://resource");
    expect(resource.config).toEqual(config);
    expect(typeof resource.callback).toBe("function");
  });

  it("should create template resource with correct name and config", () => {
    const mockCallback = vi.fn();
    const template = new ResourceTemplate("test://template/{id}", {
      list: undefined,
    });
    const config = {
      title: "Template Resource",
      description: "A template resource",
    };

    const resource = createResource(
      "template-resource",
      template,
      config,
      mockCallback,
    );

    expect(resource.name).toBe("template-resource");
    expect(resource.uriOrTemplate).toEqual(template);
    expect(resource.config).toEqual(config);
    expect(typeof resource.callback).toBe("function");
  });

  it("should handle non-Error objects thrown in static resource callback", async () => {
    const mockCallback = vi.fn().mockImplementation(() => {
      // eslint-disable-next-line no-throw-literal
      throw "String error";
    });

    const resource = createResource(
      "string-error-resource",
      "test://error",
      {
        title: "String Error Resource",
        description: "A resource that throws string",
      },
      mockCallback,
    );

    const mockUri = new URL("test://error");
    const mockExtra = {} as any;
    const result = await resource.callback(mockUri, mockExtra);

    expect(result).toEqual({
      contents: [
        {
          uri: "test://error",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              isError: true,
              error: "Unknown error occurred",
            },
            null,
            2,
          ),
        },
      ],
    });
  });
});
