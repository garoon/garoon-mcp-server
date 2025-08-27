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
      expect(tool.config.description).toBe("Create a new schedule event in Garoon");
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
        attendees: [{ id: "1" }, { code: "user2" }, { id: "3", code: "user3" }],
      };

      expect(() => schema.parse(validInput)).not.toThrow();

      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ subject: 123 })).toThrow();
    });

    it("should have valid output schema", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const schema = z.object(tool.config.outputSchema!);

      const validOutput = {
        isError: false,
        result: {
          id: "1",
          eventType: "REGULAR",
          eventMenu: "Meeting",
          subject: "Test Event",
          notes: "This is a test event",
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
            {
              type: "USER",
              id: "2",
              code: "user2",
              name: "Ninomiya Shinji",
              attendanceResponse: {
                status: "PENDING",
                comment: "I am going to attend the meeting.",
              },
            },
            {
              type: "ORGANIZATION",
              id: "1",
              code: "Sales",
              name: "Sales Department",
            },
          ],
        },
      };
      expect(() => schema.parse(validOutput)).not.toThrow();

      expect(() => schema.parse({ result: validOutput.result })).toThrow();
      expect(() =>
        schema.parse({
          isError: validOutput.isError,
          result: { ...validOutput.result, id: 123 },
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
      };

      mockPostRequest.mockResolvedValue(mockApiResponse);

      const input = {
        event: {
          subject: "Test Event",
          eventType: "REGULAR" as const,
          eventMenu: "Meeting",
          notes: "Test notes",
        },
        schedule: {
          start: {
            dateTime: "2024-07-27T11:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: "2024-07-27T12:00:00+09:00",
            timeZone: "Asia/Tokyo",
          },
        },
        attendees: [{ id: "1" }],
      };

      const result = await tool.callback(input, {} as any);

      expect(mockPostRequest).toHaveBeenCalledWith(
        "/api/v1/schedule/events",
        JSON.stringify({
          eventType: input.event.eventType,
          subject: input.event.subject,
          visibilityType: "PUBLIC",
          start: input.schedule.start,
          end: input.schedule.end,
          attendees: input.attendees.map((attendee) => {
            return { type: "USER", id: attendee.id };
          }),
          eventMenu: input.event.eventMenu,
          notes: input.event.notes,
        }),
      );

      expect(result).toHaveProperty("structuredContent");
      expect(result).toHaveProperty("content");
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");

      const structuredContent = result.structuredContent as any;
      expect(structuredContent.isError).toBe(false);
      expect(structuredContent.result).toEqual(mockApiResponse);
    });
  });
});
