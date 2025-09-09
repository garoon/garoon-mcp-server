import { describe, it, expect } from "vitest";
import { searchAvailableTimes } from "../index.js";

describe("search-available-times tool integration", () => {
  describe("tool configuration", () => {
    it("should have correct name", () => {
      expect(searchAvailableTimes.name).toBe("search-available-times");
    });

    it("should have correct title", () => {
      expect(searchAvailableTimes.config.title).toBe("Search Available Times");
    });

    it("should have correct description", () => {
      expect(searchAvailableTimes.config.description).toBe(
        "Search for available time slots for specified attendee or facility within given time ranges",
      );
    });

    it("should have input schema defined", () => {
      expect(searchAvailableTimes.config.inputSchema).toBeDefined();
      expect(searchAvailableTimes.config.inputSchema).toHaveProperty(
        "timeRanges",
      );
      expect(searchAvailableTimes.config.inputSchema).toHaveProperty(
        "timeInterval",
      );
      expect(searchAvailableTimes.config.inputSchema).toHaveProperty(
        "attendees",
      );
      expect(searchAvailableTimes.config.inputSchema).toHaveProperty(
        "facilities",
      );
      expect(searchAvailableTimes.config.inputSchema).toHaveProperty(
        "facilitySearchCondition",
      );
    });

    it("should have output schema defined", () => {
      expect(searchAvailableTimes.config.outputSchema).toBeDefined();
      expect(searchAvailableTimes.config.outputSchema).toHaveProperty(
        "isError",
      );
      expect(searchAvailableTimes.config.outputSchema).toHaveProperty("result");
    });

    it("should have callback function defined", () => {
      expect(searchAvailableTimes.callback).toBeDefined();
      expect(typeof searchAvailableTimes.callback).toBe("function");
    });
  });

  describe("tool structure", () => {
    it("should have all required properties", () => {
      expect(searchAvailableTimes).toHaveProperty("name");
      expect(searchAvailableTimes).toHaveProperty("config");
      expect(searchAvailableTimes).toHaveProperty("callback");
    });

    it("should have config with all required properties", () => {
      expect(searchAvailableTimes.config).toHaveProperty("title");
      expect(searchAvailableTimes.config).toHaveProperty("description");
      expect(searchAvailableTimes.config).toHaveProperty("inputSchema");
      expect(searchAvailableTimes.config).toHaveProperty("outputSchema");
    });
  });
});
