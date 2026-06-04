import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { hasNextSchema } from "../../../schemas/base/index.js";
import { notificationItemSchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  items: z
    .array(notificationItemSchema())
    .describe("List of notification items"),
  hasNext: hasNextSchema().describe(
    "Indicates if there are more notifications available (based on limit parameter)",
  ),
});
