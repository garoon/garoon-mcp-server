import { z } from "zod";
import { limitSchema, offsetSchema } from "../../../../schemas/index.js";

export const inputSchema = {
  parentId: z
    .number()
    .optional()
    .describe(
      "Parent category ID. Special values: 1=root (default), -1=pending approval, -2=drafts",
    ),
  limit: limitSchema().describe(
    "Maximum number of categories to return (1-1000, default: 100)",
  ),
  offset: offsetSchema().describe(
    "Number of categories to skip from the beginning (default: 0)",
  ),
};
