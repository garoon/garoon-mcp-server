import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { idSchema } from "../../../schemas/base/index.js";

export const outputSchema = createStructuredOutputSchema({
  id: idSchema().describe("Unique identifier for the created discussion"),
  title: z.string().describe("Title of the created discussion"),
  body: z
    .string()
    .optional()
    .describe("Body content of the created discussion"),
  isHtmlBody: z
    .boolean()
    .optional()
    .describe("Whether the body is HTML formatted"),
});
