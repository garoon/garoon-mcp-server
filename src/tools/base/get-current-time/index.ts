import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getCurrentTimeHandler } from "./handler.js";

export const getCurrentTimeTool = createTool(
  "get-current-time",
  {
    title: "Get the current date and time.",
    description: "Get the current datetime in RFC 3339 format.",
    inputSchema,
    outputSchema,
  },
  getCurrentTimeHandler,
);
