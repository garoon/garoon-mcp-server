import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { hasNextSchema } from "../../../schemas/base/index.js";
import { topicSummarySchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  topics: z
    .array(topicSummarySchema())
    .describe("List of bulletin topics in the category"),
  hasNext: hasNextSchema().describe(
    "Indicates if there are more topics available (based on limit parameter)",
  ),
});
