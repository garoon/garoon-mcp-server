import { z } from "zod";
import { idSchema } from "../../../schemas/base/id.js";

export const inputSchema = {
  userId: idSchema().describe(
    "User's unique ID as a numeric string (e.g., 12345)",
  ),
  rangeStart: z
    .string()
    .describe(
      "Start datetime of the search range in RFC 3339 format (e.g., 2024-01-01T00:00:00+09:00)",
    ),
  rangeEnd: z
    .string()
    .describe(
      "End datetime of the search range in RFC 3339 format (e.g., 2024-01-07T23:59:59+09:00)",
    ),
};
