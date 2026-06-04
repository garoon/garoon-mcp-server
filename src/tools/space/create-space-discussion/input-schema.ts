import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  spaceId: idSchema().describe("Space ID to create a discussion in"),
  title: z.string().describe("Title of the discussion"),
  body: z.string().optional().describe("Body content of the discussion"),
  isHtmlBody: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether the body is HTML formatted (default false)"),
};
