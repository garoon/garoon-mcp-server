import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { todoSchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema(todoSchema().shape);
