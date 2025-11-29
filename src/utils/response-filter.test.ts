import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  initializeFilterConfig,
  getFilterConfig,
  applyResponseFilter,
} from "./response-filter.js";

describe("response-filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GAROON_FILTER_PATH;
  });

  describe("initializeFilterConfig", () => {
    it("should not set config when GAROON_FILTER_PATH is not set", () => {
      initializeFilterConfig();
      expect(getFilterConfig()).toBeNull();
    });

    it("should log warning when file not found", () => {
      const consoleSpy = vi.spyOn(console, "warn");
      process.env.GAROON_FILTER_PATH = "/nonexistent/path.json";

      initializeFilterConfig();

      expect(consoleSpy).toHaveBeenCalled();
      expect(getFilterConfig()).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe("applyResponseFilter", () => {
    it("should return response unchanged when no filter config", () => {
      const response = { result: { users: [{ id: "1", name: "User1" }] } };
      const filtered = applyResponseFilter(response, "unknown-tool");
      expect(filtered).toEqual(response);
    });

    it("should return response unchanged for non-object values", () => {
      const response = "string";
      const filtered = applyResponseFilter(response, "test-tool");
      expect(filtered).toBe("string");
    });

    it("should not mutate original response", () => {
      const response = {
        result: {
          users: [{ id: "1", name: "User1" }],
          hasNext: false,
        },
      };

      const originalResponse = JSON.parse(JSON.stringify(response));
      applyResponseFilter(response, "unknown-tool");

      expect(response).toEqual(originalResponse);
    });
  });

  describe("field removal logic", () => {
    it("should handle filtering via initializeFilterConfig", () => {
      const tempFile = "/tmp/test-filter-config.json";
      const config = {
        version: "1.0",
        tools: {
          "test-tool": ["result.users"],
        },
      };

      try {
        require("fs").writeFileSync(tempFile, JSON.stringify(config));
        process.env.GAROON_FILTER_PATH = tempFile;
        initializeFilterConfig();

        const response = {
          result: {
            users: [{ id: "1", name: "User1" }],
            hasNext: false,
          },
        };

        const filtered = applyResponseFilter(response, "test-tool") as Record<
          string,
          unknown
        >;

        expect((filtered.result as Record<string, unknown>).users).toBeUndefined();
        expect((filtered.result as Record<string, unknown>).hasNext).toBe(
          false,
        );
      } finally {
        require("fs").unlinkSync(tempFile);
        delete process.env.GAROON_FILTER_PATH;
      }
    });
  });
});
