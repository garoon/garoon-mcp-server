import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { topicDetailSchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  topic: topicDetailSchema().describe("Full bulletin topic details"),
});
