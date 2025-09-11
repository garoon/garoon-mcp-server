import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";
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

export const outputSchema = createStructuredOutputSchema({
  id: idSchema().describe("Unique identifier for the created schedule event"),
  eventType: eventTypeSchema(),
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
});
