import { defineTool } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getFacilitiesInGroupHandler } from "./handler.js";

export const getFacilitiesInGroupTool = defineTool({
  name: "garoon-get-facilities-in-group",
  title: "Get Facilities In Group",
  description:
    "Get facilities that belong to a specific facility group with optional limit and offset parameters.",
  inputSchema,
  outputSchema,
  handler: getFacilitiesInGroupHandler,
});
