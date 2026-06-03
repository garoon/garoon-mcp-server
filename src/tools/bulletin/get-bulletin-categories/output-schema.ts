import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { hasNextSchema } from "../../../schemas/base/index.js";
import { categorySchema } from "../shared-schemas/index.js";

export const outputSchema = createStructuredOutputSchema({
  categories: z
    .array(categorySchema())
    .describe("List of bulletin board categories"),
  hasNext: hasNextSchema().describe(
    "Indicates if there are more categories available (based on limit parameter)",
  ),
});
