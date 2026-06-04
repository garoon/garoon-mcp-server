import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { idSchema } from "../../../schemas/base/index.js";

export const outputSchema = createStructuredOutputSchema({
  id: idSchema().describe("Unique identifier for the created comment"),
  spaceId: idSchema().describe("Space ID the comment belongs to"),
  discussionId: idSchema().describe("Discussion ID the comment belongs to"),
  body: z.string().describe("Body content of the comment"),
  isHtmlBody: z
    .boolean()
    .optional()
    .describe("Whether the body is HTML formatted"),
});
