import { describe, it, expect } from "vitest";
import { loadConfig } from "../config.js";

const baseEnv = {
  GAROON_BASE_URL: "https://example.cybozu.com",
  GAROON_USERNAME: "user",
  GAROON_PASSWORD: "secret",
};

describe("loadConfig", () => {
  it("loads a minimal valid configuration", () => {
    const config = loadConfig({ ...baseEnv });

    expect(config).toEqual({
      baseUrl: "https://example.cybozu.com",
      username: "user",
      password: "secret",
      publicOnly: false,
    });
  });

  it("includes basic auth when both credentials are present", () => {
    const config = loadConfig({
      ...baseEnv,
      GAROON_BASIC_AUTH_USERNAME: "ba-user",
      GAROON_BASIC_AUTH_PASSWORD: "ba-pass",
    });

    expect(config.basicAuth).toEqual({
      username: "ba-user",
      password: "ba-pass",
    });
  });

  it("includes PFX when both path and password are present", () => {
    const config = loadConfig({
      ...baseEnv,
      GAROON_PFX_FILE_PATH: "/path/to/cert.pfx",
      GAROON_PFX_FILE_PASSWORD: "pfx-pass",
    });

    expect(config.pfx).toEqual({
      filePath: "/path/to/cert.pfx",
      filePassword: "pfx-pass",
    });
  });

  it("derives proxyUrl from https_proxy first, then http_proxy", () => {
    expect(
      loadConfig({ ...baseEnv, https_proxy: "https://proxy:8080" }).proxyUrl,
    ).toBe("https://proxy:8080");
    expect(
      loadConfig({ ...baseEnv, http_proxy: "http://proxy:3128" }).proxyUrl,
    ).toBe("http://proxy:3128");
  });

  it.each([
    ["true", true],
    ["false", false],
    ["TRUE", false],
    ["1", false],
    [undefined, false],
  ])("interprets GAROON_PUBLIC_ONLY=%s as publicOnly=%s", (value, expected) => {
    const env = { ...baseEnv };
    if (value !== undefined) {
      (env as Record<string, string>).GAROON_PUBLIC_ONLY = value;
    }

    expect(loadConfig(env).publicOnly).toBe(expected);
  });

  it.each(["GAROON_BASE_URL", "GAROON_USERNAME", "GAROON_PASSWORD"] as const)(
    "throws when required variable %s is missing",
    (key) => {
      const env = { ...baseEnv };
      delete env[key];

      expect(() => loadConfig(env)).toThrow(key);
    },
  );

  it("throws when GAROON_BASE_URL is not an http(s) URL", () => {
    expect(() =>
      loadConfig({ ...baseEnv, GAROON_BASE_URL: "ftp://example.com" }),
    ).toThrow(/GAROON_BASE_URL/);
  });

  it("throws when GAROON_BASE_URL is malformed", () => {
    expect(() =>
      loadConfig({ ...baseEnv, GAROON_BASE_URL: "not-a-url" }),
    ).toThrow(/GAROON_BASE_URL/);
  });

  it("throws when only one basic auth credential is provided", () => {
    expect(() =>
      loadConfig({ ...baseEnv, GAROON_BASIC_AUTH_USERNAME: "ba-user" }),
    ).toThrow(/GAROON_BASIC_AUTH/);
  });

  it("throws when only one PFX field is provided", () => {
    expect(() =>
      loadConfig({ ...baseEnv, GAROON_PFX_FILE_PATH: "/path/to/cert.pfx" }),
    ).toThrow(/GAROON_PFX/);
  });

  it("treats empty-string optional variables as unset", () => {
    const config = loadConfig({
      ...baseEnv,
      GAROON_BASIC_AUTH_USERNAME: "",
      GAROON_BASIC_AUTH_PASSWORD: "",
      GAROON_PFX_FILE_PATH: "",
      GAROON_PFX_FILE_PASSWORD: "",
      https_proxy: "",
      http_proxy: "",
    });

    expect(config.basicAuth).toBeUndefined();
    expect(config.pfx).toBeUndefined();
    expect(config.proxyUrl).toBeUndefined();
  });

  it("treats a group with one empty and one populated field as a group violation", () => {
    expect(() =>
      loadConfig({
        ...baseEnv,
        GAROON_BASIC_AUTH_USERNAME: "ba-user",
        GAROON_BASIC_AUTH_PASSWORD: "",
      }),
    ).toThrow(/GAROON_BASIC_AUTH/);
  });

  it("includes the variable name in the message when a required variable is empty", () => {
    expect(() => loadConfig({ ...baseEnv, GAROON_USERNAME: "" })).toThrow(
      /GAROON_USERNAME/,
    );
  });

  // manifest.json maps every optional user_config entry with `"default": ""`,
  // so an MCPB install with blank optional fields hands the server this exact
  // environment. Startup must succeed with it.
  it("accepts the environment produced by a default MCPB installation", () => {
    const config = loadConfig({
      GAROON_BASE_URL: "https://example.cybozu.com/g",
      GAROON_USERNAME: "user",
      GAROON_PASSWORD: "secret",
      https_proxy: "",
      GAROON_PFX_FILE_PATH: "",
      GAROON_PFX_FILE_PASSWORD: "",
      GAROON_BASIC_AUTH_USERNAME: "",
      GAROON_BASIC_AUTH_PASSWORD: "",
      GAROON_PUBLIC_ONLY: "false",
    });

    expect(config).toEqual({
      baseUrl: "https://example.cybozu.com/g",
      username: "user",
      password: "secret",
      publicOnly: false,
    });
  });
});
