import { z } from "zod";
import {
  facilitySchema,
  startDateTimeSchema,
  endDateTimeSchema,
} from "#applications/schedule/schemas/index.js";
import { createStructuredOutputSchema } from "#core/structured-output.js";

export const outputSchema = createStructuredOutputSchema({
  availableTimes: z
    .array(
      z.object({
        start: startDateTimeSchema(),
        end: endDateTimeSchema(),
        facility: facilitySchema().optional(),
      }),
    )
    .describe("List of available time slots"),
});
