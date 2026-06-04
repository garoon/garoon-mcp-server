import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { workflowRequestSchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  request: workflowRequestSchema().describe("Workflow request details"),
});
