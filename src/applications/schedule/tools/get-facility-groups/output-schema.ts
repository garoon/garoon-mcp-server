import { z } from "zod";
import { createStructuredOutputSchema } from "../../../../core/structured-output.js";
import { hasNextSchema } from "../../../../schemas/index.js";
import { facilityGroupSchema } from "../../schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  facilityGroups: z
    .array(facilityGroupSchema())
    .describe("List of facility groups"),
  hasNext: hasNextSchema().describe(
    "Indicates if there are more facility groups available (based on limit parameter)",
  ),
});
