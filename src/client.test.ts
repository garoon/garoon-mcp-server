import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRequest, postRequest, HttpErrorResponse } from "./client.js";
import { setConfig, type Config } from "./config.js";
import { VERSION, EXECUTION_TYPE } from "./build-constants.js";

const baseConfig: Config = {
  baseUrl: "https://garoon.example.com/g",
  username: "user",
  password: "secret",
  publicOnly: false,
};

const fetchMock = vi.fn();

function mockJsonResponse(body: unknown) {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => body,
  });
}

function mockErrorResponse(status: number, text: string) {
  fetchMock.mockResolvedValue({
    ok: false,
    status,
    text: async () => text,
  });
}

function requestArgs(): { url: string; init: RequestInit } {
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  return { url, init };
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  setConfig({ ...baseConfig });
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("getRequest", () => {
  it("sends the Cybozu credential and User-Agent headers", async () => {
    mockJsonResponse({ ok: true });

    await getRequest("/api/v1/base/users");

    const { url, init } = requestArgs();
    expect(url).toBe("https://garoon.example.com/g/api/v1/base/users");
    expect(init.method).toBe("GET");
    expect(init.headers).toEqual({
      "X-Cybozu-Authorization": Buffer.from("user:secret").toString("base64"),
      "User-Agent": `garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`,
    });
  });

  it("omits the Authorization header when basic auth is not configured", async () => {
    mockJsonResponse({});

    await getRequest("/api/v1/base/users");

    const { init } = requestArgs();
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  it("adds a Basic Authorization header when basic auth is configured", async () => {
    setConfig({
      ...baseConfig,
      basicAuth: { username: "ba-user", password: "ba-pass" },
    });
    mockJsonResponse({});

    await getRequest("/api/v1/base/users");

    const { init } = requestArgs();
    expect(init.headers).toMatchObject({
      Authorization: `Basic ${Buffer.from("ba-user:ba-pass").toString("base64")}`,
    });
  });

  it("returns the parsed JSON body on success", async () => {
    mockJsonResponse({ users: [{ id: "1" }] });

    const result = await getRequest("/api/v1/base/users");

    expect(result).toEqual({ users: [{ id: "1" }] });
  });

  it("throws HttpErrorResponse with status and body on failure", async () => {
    mockErrorResponse(404, "Not Found");

    const request = getRequest("/api/v1/base/users");

    await expect(request).rejects.toBeInstanceOf(HttpErrorResponse);
    await expect(request).rejects.toMatchObject({
      status: 404,
      responseText: "Not Found",
    });
  });
});

describe("postRequest", () => {
  it("sends the JSON content type alongside the auth headers", async () => {
    mockJsonResponse({ id: "10" });

    await postRequest("/api/v1/schedule/events", '{"subject":"meeting"}');

    const { url, init } = requestArgs();
    expect(url).toBe("https://garoon.example.com/g/api/v1/schedule/events");
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"subject":"meeting"}');
    expect(init.headers).toEqual({
      "X-Cybozu-Authorization": Buffer.from("user:secret").toString("base64"),
      "User-Agent": `garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`,
      "Content-Type": "application/json",
    });
  });

  it("throws HttpErrorResponse with status and body on failure", async () => {
    mockErrorResponse(403, "Forbidden");

    const request = postRequest("/api/v1/schedule/events", "{}");

    await expect(request).rejects.toBeInstanceOf(HttpErrorResponse);
    await expect(request).rejects.toMatchObject({
      status: 403,
      responseText: "Forbidden",
    });
  });
});
