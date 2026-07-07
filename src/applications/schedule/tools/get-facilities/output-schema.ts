import { z } from "zod";
import { createStructuredOutputSchema } from "#core/structured-output.js";
import { facilitySchema } from "#applications/schedule/schemas/index.js";
import { hasNextSchema } from "#schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  facilities: z
    .array(facilitySchema())
    .describe("List of facilities matching the search criteria"),
  hasNext: hasNextSchema().describe(
    "Indicates if there are more facilities available (based on limit parameter)",
  ),
});
