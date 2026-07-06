import { z } from "zod";
import { createStructuredOutputSchema } from "../../../../core/structured-output.js";
import { hasNextSchema } from "../../../../schemas/index.js";
import { topicSummarySchema } from "./topic-summary.js";

export const outputSchema = createStructuredOutputSchema({
  topics: z
    .array(topicSummarySchema())
    .describe("List of bulletin topics in the category"),
  hasNext: hasNextSchema().describe(
    "Indicates if there are more topics available (based on limit parameter)",
  ),
});
