import {
  idSchema,
  limitSchema,
  offsetSchema,
} from "../../../schemas/base/index.js";

export const inputSchema = {
  facilityGroupId: idSchema().describe(
    "Facility group ID to list facilities for (numeric string)",
  ),
  limit: limitSchema().describe("Maximum number of facilities to return"),
  offset: offsetSchema().describe(
    "Number of facilities to skip from the beginning",
  ),
};
