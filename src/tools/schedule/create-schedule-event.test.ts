import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createScheduleEvent as tool } from "./create-schedule-event.js";
import { z } from "zod";
import * as client from "../../client.js";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual("../../client.js");
  return {
    ...actual,
    postRequest: vi.fn(),
  };
});

describe("create-schedule-event tool", () => {
  const mockPostRequest = vi.mocked(client.postRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("tool configuration", () => {
    it("should have correct name", () => {
      expect(tool.name).toBe("create-schedule-event");
    });

    it("should have correct description", () => {
      expect(tool.config.description).toBe(
        "Create a new schedule event in Garoon",
      );
    });

    it("should have valid input schema", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const schema = z.object(tool.config.inputSchema!);

      const validInput = {
        subject: "Test Event",
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T12:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [
          { type: "USER", id: "1" },
          { type: "USER", code: "user2" },
          { type: "ORGANIZATION", id: "3", code: "org3" },
        ],
        watchers: [
          { type: "USER", id: "10" },
          { type: "ORGANIZATION", code: "sales_team" },
          { type: "ROLE", code: "manager" },
        ],
      };

      expect(() => schema.parse(validInput)).not.toThrow();

      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ subject: 123 })).toThrow();
    });

    it("should have valid output schema", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const schema = z.object(tool.config.outputSchema!);

      const minimalValidOutput = {
        result: {
          id: "1",
          eventType: "REGULAR",
          eventMenu: "Meeting",
          subject: "Test Event",
          notes: "Test notes",
          visibilityType: "PUBLIC",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T11:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T12:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [
            {
              type: "USER",
              id: "1",
              code: "user1",
              name: "Usa Ichiro",
            },
          ],
          facilities: [],
        },
      };
      expect(() => schema.parse(minimalValidOutput)).not.toThrow();

      const fullValidOutput = {
        result: {
          id: "1",
          eventType: "REGULAR",
          eventMenu: "Meeting",
          subject: "Test Event",
          notes: "This is a test event",
          visibilityType: "PUBLIC",
          isStartOnly: false,
          isAllDay: false,
          start: {
            dateTime: "2024-07-27T11:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T12:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          attendees: [
            {
              type: "USER",
              id: "1",
              code: "user1",
              name: "Usa Ichiro",
            },
          ],
          facilities: [],
          watchers: [
            {
              type: "USER",
              id: "10",
              code: "watcher1",
              name: "Watcher User",
            },
          ],
        },
      };
      expect(() => schema.parse(fullValidOutput)).not.toThrow();

      expect(() => schema.parse({ error: "Some error" })).not.toThrow();
      expect(() =>
        schema.parse({
          result: { ...fullValidOutput.result, id: 123 },
        }),
      ).toThrow();
    });
  });

  describe("callback function", () => {
    it("should successfully create a schedule event", async () => {
      const mockApiResponse = {
        id: "123",
        eventType: "REGULAR",
        eventMenu: "Meeting",
        subject: "Test Event",
        notes: "Test notes",
        visibilityType: "PUBLIC",
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T12:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [
          {
            type: "USER",
            id: "1",
            code: "user1",
            name: "Test User",
          },
        ],
        facilities: [],
      };

      mockPostRequest.mockResolvedValue(mockApiResponse);

      const input = {
        subject: "Test Event",
        eventType: "REGULAR" as const,
        eventMenu: "Meeting",
        notes: "Test notes",
        visibilityType: "PUBLIC" as const,
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T11:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T12:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [{ type: "USER" as const, id: "1" }],
      };

      const result = await tool.callback(input, {} as any);

      expect(mockPostRequest).toHaveBeenCalledWith(
        "/api/v1/schedule/events",
        JSON.stringify({
          eventType: input.eventType,
          subject: input.subject,
          visibilityType: input.visibilityType,
          start: input.start,
          end: input.end,
          isStartOnly: input.isStartOnly,
          isAllDay: input.isAllDay,
          attendees: input.attendees.map((attendee) => ({
            type: attendee.type,
            id: attendee.id,
          })),
          eventMenu: input.eventMenu,
          notes: input.notes,
        }),
      );

      expect(result).toHaveProperty("structuredContent");
      expect(result).toHaveProperty("content");
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.result).toEqual(mockApiResponse);
      expect(structuredContent.result.id).toBe("123");
    });

    it("should successfully create a schedule event with watchers", async () => {
      const mockApiResponse = {
        id: "456",
        eventType: "REGULAR",
        eventMenu: "Meeting",
        subject: "Private Test Event",
        notes: "Test notes with watchers",
        visibilityType: "PRIVATE",
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T14:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T15:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [
          {
            type: "USER",
            id: "1",
            code: "user1",
            name: "Test User",
          },
        ],
        facilities: [],
        watchers: [
          {
            type: "USER",
            id: "10",
            code: "watcher1",
            name: "Watcher User",
          },
          {
            type: "ORGANIZATION",
            id: "20",
            code: "sales_team",
            name: "Sales Team",
          },
        ],
      };

      mockPostRequest.mockResolvedValue(mockApiResponse);

      const input = {
        subject: "Private Test Event",
        eventType: "REGULAR" as const,
        eventMenu: "Meeting",
        notes: "Test notes with watchers",
        visibilityType: "PRIVATE" as const,
        isStartOnly: false,
        isAllDay: false,
        start: {
          dateTime: "2024-07-27T14:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2024-07-27T15:00:00+09:00",
          timeZone: "Asia/Tokyo",
        },
        attendees: [{ type: "USER" as const, id: "1" }],
        watchers: [
          { type: "USER" as const, id: "10" },
          { type: "ORGANIZATION" as const, code: "sales_team" },
        ],
      };

      const result = await tool.callback(input, {} as any);

      expect(mockPostRequest).toHaveBeenCalledWith(
        "/api/v1/schedule/events",
        JSON.stringify({
          eventType: input.eventType,
          subject: input.subject,
          visibilityType: input.visibilityType,
          start: input.start,
          end: input.end,
          isStartOnly: input.isStartOnly,
          isAllDay: input.isAllDay,
          attendees: input.attendees.map((attendee) => ({
            type: attendee.type,
            id: attendee.id,
          })),
          eventMenu: input.eventMenu,
          notes: input.notes,
          watchers: [
            { type: "USER", id: "10" },
            { type: "ORGANIZATION", code: "sales_team" },
          ],
        }),
      );

      expect(result).toHaveProperty("structuredContent");
      expect(result).toHaveProperty("content");
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.result).toEqual(mockApiResponse);
      expect(structuredContent.result.id).toBe("456");
    });
  });
});
