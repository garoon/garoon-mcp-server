import { z } from "zod";
import { hasNextSchema, idSchema } from "#schemas/index.js";
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
} from "#applications/schedule/schemas/index.js";
import { createStructuredOutputSchema } from "#core/structured-output.js";

const eventObjectSchema = z.object({
  id: idSchema().describe("Unique identifier for the schedule event"),
  eventType: eventTypeResponseSchema().optional(),
  eventMenu: eventMenuSchema().optional(),
  subject: subjectSchema(),
  notes: notesSchema().optional(),
  visibilityType: visibilityTypeSchema().optional(),
  isStartOnly: isStartOnlySchema().optional(),
  isAllDay: isAllDaySchema().optional(),
  start: startDateTimeSchema(),
  end: endDateTimeSchema().optional(),
  attendees: z.array(attendeeSchema()).optional(),
  facilities: z.array(facilitySchema()).optional(),
  facilityUsingPurpose: facilityUsingPurposeSchema().optional(),
  watchers: z.array(watcherSchema()).optional(),
});

export const outputSchema = createStructuredOutputSchema({
  events: z
    .array(eventObjectSchema)
    .describe(
      "List of schedule event objects within the specified period range",
    ),
  hasNext: hasNextSchema().describe(
    "Boolean indicating if there are more results (True indicates more results exist)",
  ),
});
