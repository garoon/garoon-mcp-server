import { createStructuredOutputSchema } from "../../../../core/structured-output.js";
import { topicDetailSchema } from "../../schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  topic: topicDetailSchema().describe("Full bulletin topic details"),
});
