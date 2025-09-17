import { z } from "zod";
import { limitSchema, offsetSchema } from '../../../schemas/base/pagination.js';

export const inputSchema = {
  name: z
    .string()
    .describe(
      "Organization name to search for (e.g., 'Sales Department', 'Engineering', 'HR')",
    ),
    limit: limitSchema().describe(
        "Maximum number of organizations to return (1-1000, default: 100 - server default)",
    ),
    offset: offsetSchema().describe(    
      "Starting position for results (0 or greater, default: 0 - server default)",
    ),
};
