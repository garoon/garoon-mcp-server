import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { createdNotificationSchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema(
  createdNotificationSchema().shape,
);
