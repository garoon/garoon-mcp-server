import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createMessageHandler } from "./handler.js";

export const createMessageTool = createTool(
  "garoon-create-message",
  {
    title: "Garoon Create Message",
    description: "Create a new message in Garoon.",
    inputSchema,
    outputSchema,
  },
  createMessageHandler,
);
