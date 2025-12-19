import { limitSchema, offsetSchema } from "../../../schemas/base/index.js";
import { z } from "zod";

export const inputSchema = {
  facilityGroupId: z
    .string()
    .describe("Facility group ID to list facilities for (numeric string)"),
  limit: limitSchema().describe("Maximum number of facilities to return"),
  offset: offsetSchema().describe(
    "Number of facilities to skip from the beginning",
  ),
};
