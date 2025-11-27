import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getFacilitiesHandler } from "./handler.js";

export const getFacilitiesTool = createTool(
  "garoon-get-facilities",
  {
    title: "Get Facilities",
    description:
      "Get facilities data from Garoon by searching facility names with optional limit and offset parameters.",
    inputSchema,
    outputSchema,
  },
  getFacilitiesHandler,
);
