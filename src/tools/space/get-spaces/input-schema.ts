import { limitSchema, offsetSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  limit: limitSchema().describe(
    "Maximum number of spaces to return (default 100, max 1000)",
  ),
  offset: offsetSchema().describe(
    "Number of spaces to skip from the beginning (default 0)",
  ),
};
