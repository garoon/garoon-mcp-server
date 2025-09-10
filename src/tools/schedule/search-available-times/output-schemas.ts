import { z } from "zod";
import {
  facilitySchema,
  startDateTimeSchema,
  endDateTimeSchema,
} from "../../../schemas/schedule/common.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

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
