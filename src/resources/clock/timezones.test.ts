import { describe, it, expect } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
import { GAROON_SUPPORTED_TIMEZONES } from "../../constants.js";
import { timezonesResource as resource } from "./timezones.js";

describe("GAROON_SUPPORTED_TIMEZONES", () => {
  it("should convert all supported timezones with toZonedDateTimeISO without errors", () => {
    const now = Temporal.Now.instant();

    GAROON_SUPPORTED_TIMEZONES.forEach((timezone) => {
      expect(() => {
        const zonedDateTime = now.toZonedDateTimeISO(timezone);
        // Convert Garoon's datetime string format
        const datetimeString = zonedDateTime
          .toString({ smallestUnit: "second" })
          .replace(/\[.*$/, "");

        expect(typeof datetimeString).toBe("string");
        expect(datetimeString.length).toBeGreaterThan(0);

        // Check RFC 3339 format or not
        expect(datetimeString).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/,
        );
      }).not.toThrow();
    });
  });
});

describe("garoon-supported-timezones resource", () => {
  describe("resource configuration", () => {
    it("should have correct name", () => {
      expect(resource.name).toBe("garoon-supported-timezones");
    });

    it("should have correct uri", () => {
      expect(resource.uriOrTemplate).toBe("timezone://list");
    });

    it("should have correct title", () => {
      expect(resource.config.title).toBe("Garoon Supported Timezones");
    });

    it("should have correct description", () => {
      expect(resource.config.description).toContain(
        "Get the list of timezone identifiers supported by Garoon.  (e.g., 'Asia/Tokyo', 'America/New_York')",
      );
    });

    it("should have correct mimeType", () => {
      expect(resource.config.mimeType).toBe("application/json");
    });
  });

  describe("callback function", () => {
    it("should return a valid list of supported timezones", async () => {
      const uri = new URL("timezone://list");
      const result = await resource.callback(uri, {} as any);
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe(uri.href);
      expect(result.contents[0].mimeType).toBe("application/json");
      const parsedResult = JSON.parse(result.contents[0].text as string);
      expect(parsedResult).toEqual({
        isError: false,
        result: {
          timezones: GAROON_SUPPORTED_TIMEZONES,
        },
      });
    });
  });
});
