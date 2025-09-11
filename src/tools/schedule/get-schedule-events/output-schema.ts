import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";
import {
  subjectSchema,
  notesSchema,
  startDateTimeSchema,
  endDateTimeSchema,
} from "../shared-schemas/index.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  events: z
    .array(
      z.object({
        id: idSchema().describe("Unique ID of the schedule event"),
        subject: subjectSchema(),
        start: startDateTimeSchema(),
        end: endDateTimeSchema(),
        notes: notesSchema(),
      }),
    )
    .describe(
      "List of schedule event objects within the specified period range",
    ),
  hasNext: z
    .boolean()
    .describe(
      "Boolean indicating if there are more results (True indicates more results exist)",
    ),
});
