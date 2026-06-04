import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";
import {
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
  eventId: idSchema().describe("The ID of the schedule event to update"),
  subject: subjectSchema().optional(),
  notes: notesSchema().optional(),
  eventMenu: eventMenuSchema().optional(),
  start: startDateTimeSchema().optional(),
  end: endDateTimeSchema().optional(),
  isAllDay: isAllDaySchema().optional(),
  isStartOnly: isStartOnlySchema().optional(),
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
  visibilityType: visibilityTypeSchema().optional(),
  watchers: z
    .array(watcherInputSchema())
    .optional()
    .describe("List of watchers for the schedule event"),
  companyInfo: z
    .object({
      name: z.string().optional().describe("Company name"),
      zipCode: z.string().optional().describe("Zip code"),
      address: z.string().optional().describe("Address"),
      route: z.string().optional().describe("Route"),
      routeTime: z.string().optional().describe("Route time"),
      routeFare: z.string().optional().describe("Route fare"),
      phone: z.string().optional().describe("Phone number"),
    })
    .optional()
    .describe("Company information for the event"),
  useAttendanceCheck: z
    .boolean()
    .optional()
    .describe("Whether to enable attendance check"),
  notifyAttendees: z
    .boolean()
    .optional()
    .describe("Whether to notify attendees about the update"),
};
