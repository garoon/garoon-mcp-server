import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { facilitySchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  facilities: z
    .array(facilitySchema())
    .describe("List of facilities matching the search criteria"),
  hasNext: z
    .boolean()
    .describe(
      "Indicates if there are more facilities available (based on limit parameter)",
    ),
});
