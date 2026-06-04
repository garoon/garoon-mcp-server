import {
  todoSubjectSchema,
  todoPrioritySchema,
  todoNotesSchema,
} from "../shared-schemas/index.js";
import { z } from "zod";

export const inputSchema = {
  subject: todoSubjectSchema().describe(
    "Subject of the TODO item (required, max 100 characters)",
  ),
  category: z.number().optional().describe("Category ID for the TODO item"),
  dueDate: z
    .string()
    .optional()
    .describe("Due date in ISO8601 format (e.g., 2024-12-31T23:59:59+09:00)"),
  priority: todoPrioritySchema()
    .default(2)
    .describe(
      "Priority of the TODO item (1: High, 2: Normal, 3: Low). Defaults to 2",
    ),
  notes: todoNotesSchema()
    .optional()
    .describe("Additional notes for the TODO item"),
};
