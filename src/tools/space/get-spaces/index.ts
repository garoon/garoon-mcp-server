import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getSpacesHandler } from "./handler.js";

export const getSpacesTool = createTool(
  "garoon-get-spaces",
  {
    title: "Get Spaces",
    description:
      "Get a list of spaces from Garoon with optional limit and offset parameters.",
    inputSchema,
    outputSchema,
  },
  getSpacesHandler,
);
