import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import {
  attendeeSchema,
  eventTypeSchema,
  eventMenuSchema,
  idSchema,
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
} from "../../../schemas/schedule/common.js";

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
