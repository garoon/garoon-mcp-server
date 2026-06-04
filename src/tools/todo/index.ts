import { getTodoTool } from "./get-todo/index.js";
import { createTodoTool } from "./create-todo/index.js";
import { getTodoCategoriesTool } from "./get-todo-categories/index.js";

export const todoTools = [getTodoTool, createTodoTool, getTodoCategoriesTool];
