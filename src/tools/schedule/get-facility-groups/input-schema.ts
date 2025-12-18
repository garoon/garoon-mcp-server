import { limitSchema, offsetSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  limit: limitSchema().describe("Maximum number of facility groups to return"),
  offset: offsetSchema().describe(
    "Number of facility groups to skip from the beginning",
  ),
};
