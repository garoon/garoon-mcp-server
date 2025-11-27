import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getCurrentTimeHandler } from "./handler.js";

export const getCurrentTimeTool = createTool(
  "garoon-get-current-time",
  {
    title: "Get Current Datetime",
    description: "Get the current datetime in RFC 3339 format in Garoon.",
    inputSchema,
    outputSchema,
  },
  getCurrentTimeHandler,
);
