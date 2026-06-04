import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  spaceId: idSchema().describe("Space ID the discussion belongs to"),
  discussionId: idSchema().describe("Discussion ID to add a comment to"),
  body: z.string().describe("Body content of the comment"),
  isHtmlBody: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether the body is HTML formatted (default false)"),
};
