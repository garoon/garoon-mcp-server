import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getTodoHandler } from "./handler.js";

export const getTodoTool = createTool(
  "garoon-get-todo",
  {
    title: "Garoon Get TODO",
    description: "Get a specific TODO item from Garoon by its ID.",
    inputSchema,
    outputSchema,
  },
  getTodoHandler,
);
