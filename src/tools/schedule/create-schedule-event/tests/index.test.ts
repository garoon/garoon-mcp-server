import { describe, it, expect } from "vitest";
import { createScheduleEvent } from "../index.js";

describe("create-schedule-event tool integration", () => {
  describe("tool configuration", () => {
    it("should have correct name", () => {
      expect(createScheduleEvent.name).toBe("create-schedule-event");
    });

    it("should have correct title", () => {
      expect(createScheduleEvent.config.title).toBe("Create Schedule Event");
    });

    it("should have correct description", () => {
      expect(createScheduleEvent.config.description).toBe(
        "Create a new schedule event in Garoon",
      );
    });

    it("should have input schema defined", () => {
      expect(createScheduleEvent.config.inputSchema).toBeDefined();
      expect(createScheduleEvent.config.inputSchema).toHaveProperty("subject");
      expect(createScheduleEvent.config.inputSchema).toHaveProperty("start");
      expect(createScheduleEvent.config.inputSchema).toHaveProperty("end");
      expect(createScheduleEvent.config.inputSchema).toHaveProperty(
        "eventType",
      );
      expect(createScheduleEvent.config.inputSchema).toHaveProperty(
        "eventMenu",
      );
      expect(createScheduleEvent.config.inputSchema).toHaveProperty("notes");
      expect(createScheduleEvent.config.inputSchema).toHaveProperty(
        "visibilityType",
      );
      expect(createScheduleEvent.config.inputSchema).toHaveProperty(
        "isStartOnly",
      );
      expect(createScheduleEvent.config.inputSchema).toHaveProperty("isAllDay");
      expect(createScheduleEvent.config.inputSchema).toHaveProperty(
        "attendees",
      );
      expect(createScheduleEvent.config.inputSchema).toHaveProperty(
        "facilities",
      );
      expect(createScheduleEvent.config.inputSchema).toHaveProperty(
        "facilityUsingPurpose",
      );
      expect(createScheduleEvent.config.inputSchema).toHaveProperty("watchers");
    });

    it("should have output schema defined", () => {
      expect(createScheduleEvent.config.outputSchema).toBeDefined();
      expect(createScheduleEvent.config.outputSchema).toHaveProperty("isError");
      expect(createScheduleEvent.config.outputSchema).toHaveProperty("result");
    });

    it("should have callback function defined", () => {
      expect(createScheduleEvent.callback).toBeDefined();
      expect(typeof createScheduleEvent.callback).toBe("function");
    });
  });

  describe("tool structure", () => {
    it("should have all required properties", () => {
      expect(createScheduleEvent).toHaveProperty("name");
      expect(createScheduleEvent).toHaveProperty("config");
      expect(createScheduleEvent).toHaveProperty("callback");
    });

    it("should have config with all required properties", () => {
      expect(createScheduleEvent.config).toHaveProperty("title");
      expect(createScheduleEvent.config).toHaveProperty("description");
      expect(createScheduleEvent.config).toHaveProperty("inputSchema");
      expect(createScheduleEvent.config).toHaveProperty("outputSchema");
    });
  });
});
