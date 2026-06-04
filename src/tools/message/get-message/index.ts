import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getMessageHandler } from "./handler.js";

export const getMessageTool = createTool(
  "garoon-get-message",
  {
    title: "Garoon Get Message",
    description: "Get a specific message from Garoon by its ID.",
    inputSchema,
    outputSchema,
  },
  getMessageHandler,
);
