import { defineTool } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getFacilityGroupsHandler } from "./handler.js";

export const getFacilityGroupsTool = defineTool({
  name: "garoon-get-facility-groups",
  title: "Garoon Get Facility Groups",
  description:
    "Get facility groups data from Garoon with optional limit and offset parameters.",
  inputSchema,
  outputSchema,
  handler: getFacilityGroupsHandler,
});
