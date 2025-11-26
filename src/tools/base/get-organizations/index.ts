import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getOrganizationsHandler } from "./handler.js";

export const getOrganizationsTool = createTool(
  "garoon-get-organizations",
  {
    title: "Get Organizations",
    description:
      "Get Garoon organization's name, ID, and code data by searching for organization names - supports pagination with optional limit and offset parameters.",
    inputSchema,
    outputSchema,
  },
  getOrganizationsHandler,
);
