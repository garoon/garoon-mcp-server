import { idSchema, limitSchema, offsetSchema } from "#schemas/index.js";

export const inputSchema = {
  categoryId: idSchema().describe(
    "Category ID to get topics from (numeric string)",
  ),
  limit: limitSchema().describe(
    "Maximum number of topics to return (1-1000, default: 100)",
  ),
  offset: offsetSchema().describe(
    "Number of topics to skip from the beginning (default: 0)",
  ),
};
