import {
  idSchema,
  limitSchema,
  offsetSchema,
} from "../../../schemas/base/index.js";

export const inputSchema = {
  spaceId: idSchema().describe("Space ID to list discussions for"),
  limit: limitSchema().describe(
    "Maximum number of discussions to return (default 100, max 1000)",
  ),
  offset: offsetSchema().describe(
    "Number of discussions to skip from the beginning (default 0)",
  ),
};
