import {
  idSchema,
  limitSchema,
  offsetSchema,
} from "../../../schemas/base/index.js";

export const inputSchema = {
  organizationId: idSchema().describe(
    "Organization unique ID as a numeric string (e.g., 12345)",
  ),
  limit: limitSchema().describe("Maximum number of users to return (optional)"),
  offset: offsetSchema().describe(
    "Number of users to skip from the beginning (optional)",
  ),
};
