import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { messageSchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema(messageSchema().shape);
