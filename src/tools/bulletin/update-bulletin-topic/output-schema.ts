import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { topicDetailSchema } from "../shared-schemas/index.js";

const topicShape = topicDetailSchema().shape;

export const outputSchema = createStructuredOutputSchema({
  ...topicShape,
});
