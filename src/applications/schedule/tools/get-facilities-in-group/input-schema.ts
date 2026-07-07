import { idSchema, limitSchema, offsetSchema } from "#schemas/index.js";

export const inputSchema = {
  facilityGroupId: idSchema().describe(
    "Facility group ID to list facilities for (numeric string)",
  ),
  limit: limitSchema().describe(
    "Maximum number of facilities to return (1-1000, default: 100)",
  ),
  offset: offsetSchema().describe(
    "Number of facilities to skip from the beginning (default: 0)",
  ),
};
