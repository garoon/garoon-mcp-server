import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  value: z
    .record(z.unknown())
    .describe("The datastore value as a key-value object"),
});
