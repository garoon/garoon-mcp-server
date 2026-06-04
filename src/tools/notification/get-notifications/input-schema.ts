import { z } from "zod";
import { limitSchema, offsetSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  fields: z
    .string()
    .optional()
    .describe("Comma-separated list of fields to include in the response"),
  limit: limitSchema().describe(
    "Maximum number of notifications to return (1-1000, default 100)",
  ),
  offset: offsetSchema().describe(
    "Number of notifications to skip from the beginning (default 0)",
  ),
};
