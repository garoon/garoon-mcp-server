import { z } from "zod";
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
  attendeeInputSchema,
  watcherInputSchema,
} from "../shared-schemas/index.js";
import { facilityInputSchema } from "../shared-schemas/facility.js";

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
    .array(attendeeInputSchema())
    .optional()
    .describe("List of attendees for the schedule event"),
  facilities: z
    .array(facilityInputSchema())
    .optional()
    .describe("List of facilities for the schedule event"),
  facilityUsingPurpose: facilityUsingPurposeSchema()
    .optional()
    .describe(
      "Facility usage purpose - required if 'Application for facility use' is enabled",
    ),
  watchers: z
    .array(watcherInputSchema())
    .optional()
    .describe("List of watchers for the schedule event"),
};
