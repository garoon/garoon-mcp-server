import { z } from "zod";
import { idSchema } from "../../../schemas/base/id.js";
import {
  eventTypeSchema,
  eventMenuSchema,
  subjectSchema,
  notesSchema,
  startDateTimeSchema,
  endDateTimeSchema,
  facilityUsingPurposeSchema,
  visibilityTypeSchema,
  isStartOnlySchema,
  isAllDaySchema,
} from "../shared-schemas/index.js";

const attendeeInputSchema = z
  .object({
    type: z.enum(["ORGANIZATION", "USER"]).describe("Participant type"),
    id: idSchema().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.id || data.code, {
    message: "Either id or code is required for attendee",
    path: ["id", "code"],
  })
  .describe(
    "Attendee identified by type and either id or code. If both are provided, id is used.",
  );

const facilityInputSchema = z
  .object({
    id: idSchema().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.id || data.code, {
    message: "Either id or code is required for facility",
    path: ["id", "code"],
  })
  .describe("Facility identified by either id or code");

const watcherInputSchema = z
  .object({
    type: z.enum(["ORGANIZATION", "USER", "ROLE"]).describe("Watcher type"),
    id: idSchema().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.id || data.code, {
    message: "Either id or code is required for watcher",
    path: ["id", "code"],
  })
  .describe(
    "Watcher identified by type and either id or code. If both are provided, id is used.",
  );

export const inputSchema = {
  subject: subjectSchema().default("New Schedule"),
  start: startDateTimeSchema(),
  end: endDateTimeSchema().optional(),
  isStartOnly: isStartOnlySchema().default(false),
  isAllDay: isAllDaySchema().default(false),
  eventType: eventTypeSchema().default("REGULAR"),
  eventMenu: eventMenuSchema().optional(),
  notes: notesSchema().optional(),
  visibilityType: visibilityTypeSchema().default("PUBLIC"),
  attendees: z
    .array(attendeeInputSchema)
    .optional()
    .describe("List of attendees for the schedule event"),
  facilities: z
    .array(facilityInputSchema)
    .optional()
    .describe("List of facilities for the schedule event"),
  facilityUsingPurpose: facilityUsingPurposeSchema()
    .optional()
    .describe(
      "Facility usage purpose - required if 'Application for facility use' is enabled",
    ),
  watchers: z
    .array(watcherInputSchema)
    .optional()
    .describe("List of watchers for the schedule event"),
};
