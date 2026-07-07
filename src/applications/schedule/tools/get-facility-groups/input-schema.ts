import { limitSchema, offsetSchema } from "#schemas/index.js";

export const inputSchema = {
  limit: limitSchema().describe(
    "Maximum number of facility groups to return (1-1000, default: 100)",
  ),
  offset: offsetSchema().describe(
    "Number of facility groups to skip from the beginning (default: 0)",
  ),
};
