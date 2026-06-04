import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getTodoCategoriesHandler } from "./handler.js";

export const getTodoCategoriesTool = createTool(
  "garoon-get-todo-categories",
  {
    title: "Garoon Get TODO Categories",
    description:
      "Get TODO categories from Garoon with optional limit and offset parameters.",
    inputSchema,
    outputSchema,
  },
  getTodoCategoriesHandler,
);
