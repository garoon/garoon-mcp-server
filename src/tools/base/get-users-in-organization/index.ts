import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getUsersInOrganizationHandler } from "./handler.js";

export const getUserInOrganizationTool = createTool(
  "garoon-get-users-in-organization",
  {
    title: "Get Users In Organization",
    description:
      "Get users from a specific organization with support for pagination parameters (limit, offset) in Garoon.",
    inputSchema,
    outputSchema,
  },
  getUsersInOrganizationHandler,
);
