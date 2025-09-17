import { z } from "zod";
import { organizationSchema } from "../../../schemas/base/index.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  organizations: z
    .array(organizationSchema())
    .describe("List of organizations matching the search criteria"),
  hasNext: z.boolean().describe("Whether there are more results available"),
});
