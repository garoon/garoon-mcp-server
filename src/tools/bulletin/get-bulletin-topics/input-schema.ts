import {
  idSchema,
  limitSchema,
  offsetSchema,
} from "../../../schemas/base/index.js";

export const inputSchema = {
  categoryId: idSchema().describe(
    "Category ID to get topics from (numeric string)",
  ),
  limit: limitSchema().describe(
    "Maximum number of topics to return (default: 100)",
  ),
  offset: offsetSchema().describe(
    "Number of topics to skip from the beginning (default: 0)",
  ),
};
