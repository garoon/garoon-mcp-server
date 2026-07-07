import { createStructuredOutputSchema } from "#core/structured-output.js";
import { topicDetailSchema } from "./topic-detail.js";

export const outputSchema = createStructuredOutputSchema({
  topic: topicDetailSchema().describe("Full bulletin topic details"),
});
