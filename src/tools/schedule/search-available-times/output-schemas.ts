import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import {
  startDateTimeSchema,
  endDateTimeSchema,
  facilitySchema,
} from "../../../schemas/schedule/common.js";

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
