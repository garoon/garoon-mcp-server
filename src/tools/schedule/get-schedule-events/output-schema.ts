import { z } from "zod";
import { hasNextSchema, idSchema } from "../../../schemas/base/index.js";
import {
  attendeeSchema,
  eventTypeSchema,
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

const eventObjectSchema = z.object({
  id: idSchema().describe("Unique identifier for the schedule event"),
  eventType: eventTypeSchema().optional(),
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
