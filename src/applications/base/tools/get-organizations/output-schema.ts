import { z } from "zod";
import { hasNextSchema, organizationSchema } from "#schemas/index.js";
import { createStructuredOutputSchema } from "#core/structured-output.js";

export const outputSchema = createStructuredOutputSchema({
  organizations: z
    .array(organizationSchema())
    .describe("List of organizations matching the search criteria"),
  hasNext: hasNextSchema(),
});
