import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";
import {
  attendeeSchema,
  eventTypeResponseSchema,
  eventMenuSchema,
  subjectSchema,
  notesSchema,
  startDateTimeSchema,
  endDateTimeSchema,
  facilitySchema,
  facilityUsingPurposeSchema,
  visibilityTypeSchema,
  watcherSchema,
  isStartOnlySchema,
  isAllDaySchema,
} from "../shared-schemas/index.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  id: idSchema().describe("Unique identifier for the schedule event"),
  eventType: eventTypeResponseSchema(),
  eventMenu: eventMenuSchema().optional(),
  subject: subjectSchema(),
  notes: notesSchema().optional(),
  visibilityType: visibilityTypeSchema().optional(),
  isStartOnly: isStartOnlySchema(),
  isAllDay: isAllDaySchema(),
  start: startDateTimeSchema(),
  end: endDateTimeSchema().optional(),
  attendees: z.array(attendeeSchema()),
  facilities: z.array(facilitySchema()).optional(),
  facilityUsingPurpose: facilityUsingPurposeSchema().optional(),
  watchers: z.array(watcherSchema()).optional(),
  useAttendanceCheck: z
    .boolean()
    .optional()
    .describe("Whether attendance check is enabled"),
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
  attachments: z
    .array(
      z.object({
        id: idSchema().describe("Attachment ID"),
        name: z.string().describe("Attachment file name"),
        contentType: z.string().describe("MIME content type"),
        size: z.string().describe("File size"),
      }),
    )
    .optional()
    .describe("File attachments"),
  repeatInfo: z
    .record(z.unknown())
    .optional()
    .describe("Repeat information for recurring events"),
  temporaryEventCandidates: z
    .array(z.record(z.unknown()))
    .optional()
    .describe("Temporary event candidates"),
});
