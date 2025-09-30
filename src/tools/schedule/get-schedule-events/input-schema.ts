import { z } from "zod";
import {
  idSchema,
  limitSchema,
  offsetSchema,
} from "../../../schemas/base/index.js";

export const inputSchema = {
  target: idSchema().describe(
    "Target ID as a numeric string (e.g., 12345) - user ID, organization ID, or facility ID",
  ),
  targetType: z
    .enum(["user", "organization", "facility"])
    .default("user")
    .describe(
      "Type of target: 'user', 'organization', or 'facility' (default: 'user')",
    ),
  rangeStart: z
    .string()
    .describe(
      "Start datetime of the search range in RFC 3339 format (e.g., 2024-01-01T00:00:00+09:00). Must be before rangeEnd",
    ),
  rangeEnd: z
    .string()
    .describe(
      "End datetime of the search range in RFC 3339 format (e.g., 2024-01-07T23:59:59+09:00). Must be after rangeStart",
    ),
  showPrivate: z
    .boolean()
    .default(true)
    .optional()
    .describe(
      "Whether to include private events in the search results. When true, includes both public and private events. When false, only public events are returned",
    ),
  limit: limitSchema().describe(
    "Maximum number of events to return (1-1000, default: 100 - server default)",
  ),
  offset: offsetSchema().describe(
    "Starting position for results (0 or greater, default: 0 - server default)",
  ),
};
