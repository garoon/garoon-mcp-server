import { idSchema, userSchema } from "../../../schemas/base/index.js";
import { z } from "zod";

export const eventTypeSchema = () =>
  z
    .enum(["REGULAR", "ALL_DAY"])
    .describe(
      "Event type that determines validation rules: 'REGULAR' = event with specific start/end times (can be modified by isAllDay flag start-00:00, end-23:59), 'ALL_DAY' = event spanning full days without time specifications (only date matters)",
    );

export const eventMenuSchema = () =>
  z.string().describe("The event label (e.g., 'Meeting', 'Holiday', etc.)");

export const subjectSchema = () =>
  z.string().describe("Subject/title of schedule event");

export const notesSchema = () =>
  z.string().describe("Notes/description of the schedule event");

export const isStartOnlySchema = () =>
  z
    .boolean()
    .describe(
      "When true, the event only has a start time (no end time). When false, both start and end times are required. This field controls whether the 'end' parameter is mandatory.",
    );

export const isAllDaySchema = () =>
  z
    .boolean()
    .describe(
      "Only applies to REGULAR events. When true, the event spans the entire day but still requires specific start/end times (start-00:00, end-23:59). This is different from ALL_DAY event type which doesn't require time specifications.",
    );

export const startDateTimeSchema = () =>
  z
    .object({
      dateTime: z
        .string()
        .describe(
          "Start datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)",
        ),
      timeZone: z
        .string()
        .describe("Time Zone of start datetime (e.g., Asia/Tokyo)"),
    })
    .describe(
      "Start datetime of the event - ALWAYS REQUIRED for both REGULAR and ALL_DAY events",
    );

export const endDateTimeSchema = () =>
  z
    .object({
      dateTime: z
        .string()
        .describe(
          "End datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)",
        ),
      timeZone: z
        .string()
        .describe("Time Zone of end datetime (e.g., Asia/Tokyo)"),
    })
    .describe(
      "End datetime of the event - REQUIRED when isStartOnly=false, OPTIONAL when isStartOnly=true. For ALL_DAY events, endDateTime is always required",
    );

export const visibilityTypeSchema = () =>
  z
    .enum(["PUBLIC", "PRIVATE"])
    .describe("Publishing type { 'PUBLIC': 'Public', 'PRIVATE': 'Private' }");

export const attendeeSchema = () =>
  userSchema()
    .extend({
      type: z.string().describe("Type of attendee"),
      attendanceResponse: z
        .object({
          status: z.string().describe("Attendance status (e.g., 'PENDING')"),
          comment: z
            .string()
            .optional()
            .describe(
              "Comment provided by the attendee regarding their attendance",
            ),
        })
        .optional()
        .describe("Attendance response from the attendee"),
    })
    .describe("List of attendees for the schedule event");

export const watcherSchema = () =>
  z
    .object({
      type: z
        .enum(["ORGANIZATION", "USER", "ROLE"])
        .describe("Watcher type - Organization, User, or Role"),
      id: idSchema().describe(
        "Unique identifier for the watcher (organization id, user id, or role id)",
      ),
      code: z
        .string()
        .describe(
          "Code for the watcher (organization code, user code, or role code)",
        ),
      name: z
        .string()
        .describe(
          "Name for the watcher (organization name, user name, or role name)",
        ),
    })
    .describe(
      "Watcher configuration - either id or code is required, if both are provided id takes precedence",
    );

export const facilityUsingPurposeSchema = () =>
  z
    .string()
    .describe(
      "Facility usage purpose - required if 'Application for facility use' is enabled",
    );
