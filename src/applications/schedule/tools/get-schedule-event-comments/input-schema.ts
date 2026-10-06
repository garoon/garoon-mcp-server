import { idSchema, limitSchema, offsetSchema } from "#schemas/index.js";

export const inputSchema = {
  eventId: idSchema().describe(
    "Schedule event ID to list comments for (numeric string)",
  ),
  limit: limitSchema().describe(
    "Maximum number of comments to return (1-1000, default: 100)",
  ),
  offset: offsetSchema().describe(
    "Number of comments to skip from the beginning (default: 0)",
  ),
};
