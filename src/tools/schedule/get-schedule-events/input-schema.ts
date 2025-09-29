import { z } from "zod";
import {
  idSchema,
  limitSchema,
  offsetSchema,
} from "../../../schemas/base/index.js";

export const inputSchema = {
  userId: idSchema()
    .optional()
    .describe(
      "User ID as a numeric string (e.g., 12345). Either userId or userName must be provided.",
    ),
  userName: z
    .string()
    .optional()
    .describe(
      "User name or code (e.g., 'Administrator', 't-tanaka'). Either userId or userName must be provided.",
    ),
  organizationId: idSchema()
    .optional()
    .describe(
      "Organization ID as a numeric string (e.g., 12345). Either organizationId or organizationName must be provided.",
    ),
  organizationName: z
    .string()
    .optional()
    .describe(
      "Organization name (e.g., 'Sales Department', 'Engineering'). Either organizationId or organizationName must be provided.",
    ),
  facilityId: idSchema()
    .optional()
    .describe(
      "Facility ID as a numeric string (e.g., 12345). Either facilityId or facilityName must be provided.",
    ),
  facilityName: z
    .string()
    .optional()
    .describe(
      "Facility name (e.g., 'Conference Room A', 'Meeting Room 1'). Either facilityId or facilityName must be provided.",
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
