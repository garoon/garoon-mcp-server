import { z } from "zod";

export const idSchema = () => z.string().describe("Unique identifier as a numeric string (e.g., 12345)");

export const userSchema = () =>
  z.object({
    id: idSchema().describe("User unique identifier as a numeric string (e.g., 12345)"),
    code: z
      .string()
      .describe(
        "String code assigned to user (e.g., 'jiro_suzuki', 'user123') or organization (e.g., 'sales_department', 'engineering')",
      ),
    name: z.string().describe("Name displayed in screen"),
  });

export const attendeeSchema = () =>
  userSchema()
    .extend({
      type: z.string().describe("Type of attendee"),
      attendanceResponse: z
        .object({
          status: z.string().describe("Attendance status (e.g., 'PENDING')"),
          comment: z.string().optional().describe("Comment provided by the attendee regarding their attendance"),
        })
        .optional()
        .describe("Attendance response from the attendee"),
    })
    .describe("List of attendees for the schedule event");

export const dateTimeSchema = () =>
  z.object({
    dateTime: z.string().describe("Datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)"),
    timeZone: z.string().describe("Time Zone (e.g., Asia/Tokyo)"),
  });

export const startDateTimeSchema = () =>
  z
    .object({
      dateTime: z.string().describe("Start datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)"),
      timeZone: z.string().describe("Time Zone of start datetime (e.g., Asia/Tokyo)"),
    })
    .describe("Start datetime of the event");

export const endDateTimeSchema = () =>
  z
    .object({
      dateTime: z.string().describe("End datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)"),
      timeZone: z.string().describe("Time Zone of end datetime (e.g., Asia/Tokyo)"),
    })
    .describe("End datetime of the event");

export const eventTypeSchema = () =>
  z
    .enum(["REGULAR", "ALL_DAY"])
    .describe("The event type { 'REGULAR': 'Onetime event', 'ALL_DAY': 'All day event without a specific time' }");

export const eventMenuSchema = () => z.string().describe("The event label (e.g., 'Meeting', 'Holiday', etc.)");

export const subjectSchema = () => z.string().describe("Subject/title of schedule event");

export const notesSchema = () => z.string().describe("Notes/description of the schedule event");

export const facilitySchema = () =>
  z.object({
    id: idSchema().describe("Facility unique identifier as a numeric string (e.g., 12345)"),
    code: z.string().describe("Facility code (e.g., '101', '202')"),
    name: z.string().describe("Facility name (e.g., 'Conference Room 1', 'Meeting Room 2')"),
  });

export const facilityUsingPurposeSchema = () =>
  z.string().describe("Facility usage purpose - required if 'Application for facility use' is enabled");

export const visibilityTypeSchema = () =>
  z
    .enum(["PUBLIC", "PRIVATE"])
    .describe("Publishing type { 'PUBLIC': 'Public', 'PRIVATE': 'Private' }");

export const watcherSchema = () =>
  z.object({
    type: z.enum(["ORGANIZATION", "USER", "ROLE"]).describe("Watcher type - Organization, User, or Role"),
    id: idSchema().optional().describe("Unique identifier for the watcher (Organization ID, Garoon user ID, or Role ID)"),
    code: z.string().optional().describe("Code for the watcher (Organization code, Garoon user name/login name, or Role name)"),
  }).refine(
    (data) => data.id || data.code,
    {
      message: "Either id or code is required for watcher",
      path: ["id", "code"]
    }
  ).describe("Watcher configuration - either id or code is required, if both are provided id takes precedence");
