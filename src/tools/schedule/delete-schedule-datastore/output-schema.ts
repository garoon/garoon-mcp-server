import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  success: z.boolean().describe("Whether the deletion was successful"),
});
