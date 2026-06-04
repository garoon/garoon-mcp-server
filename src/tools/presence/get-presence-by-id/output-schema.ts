import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { presenceSchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  presence: presenceSchema().describe("Presence information for the user"),
});
