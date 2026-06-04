import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createTodoHandler } from "./handler.js";

export const createTodoTool = createTool(
  "garoon-create-todo",
  {
    title: "Garoon Create TODO",
    description: "Create a new TODO item in Garoon.",
    inputSchema,
    outputSchema,
  },
  createTodoHandler,
);
