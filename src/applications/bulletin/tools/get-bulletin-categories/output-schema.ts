import { z } from "zod";
import { createStructuredOutputSchema } from "../../../../core/structured-output.js";
import { hasNextSchema } from "../../../../schemas/index.js";
import { categorySchema } from "../../schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  categories: z
    .array(categorySchema())
    .describe("List of bulletin board categories"),
  hasNext: hasNextSchema().describe(
    "Indicates if there are more categories available (based on limit parameter)",
  ),
});
