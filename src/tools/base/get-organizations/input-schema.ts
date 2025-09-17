import { z } from "zod";

export const inputSchema = {
  name: z
    .string()
    .describe(
      "Organization name to search for (e.g., 'Sales Department', 'Engineering', 'HR')",
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .describe(
      "Maximum number of organizations to return (1-1000, default: 100 - server default)",
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      "Starting position for results (0 or greater, default: 0 - server default)",
    ),
};
