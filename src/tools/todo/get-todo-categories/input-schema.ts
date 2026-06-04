import { limitSchema, offsetSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  limit: limitSchema().describe(
    "Maximum number of categories to return (1-1000, default 100)",
  ),
  offset: offsetSchema().describe(
    "Number of categories to skip from the beginning (default 0)",
  ),
};
