import { z } from "zod";

export const todoIdSchema = () =>
  z.number().describe("Unique identifier for the TODO item");

export const todoStatusSchema = () =>
  z
    .enum(["Completed", "Uncompleted"])
    .describe("Status of the TODO item (Completed or Uncompleted)");

export const todoCategorySchema = () =>
  z.number().describe("Category ID of the TODO item");

export const todoSubjectSchema = () =>
  z.string().max(100).describe("Subject of the TODO item (max 100 characters)");

export const todoHasDueDateSchema = () =>
  z.boolean().describe("Whether the TODO item has a due date");

export const todoDueDateSchema = () =>
  z.string().describe("Due date of the TODO item in ISO8601 format");

export const todoPrioritySchema = () =>
  z
    .number()
    .min(1)
    .max(3)
    .describe("Priority of the TODO item (1: High, 2: Normal, 3: Low)");

export const todoNotesSchema = () =>
  z.string().describe("Notes for the TODO item");

export const todoSchema = () =>
  z.object({
    id: todoIdSchema(),
    status: todoStatusSchema(),
    category: todoCategorySchema(),
    subject: todoSubjectSchema(),
    hasDueDate: todoHasDueDateSchema(),
    dueDate: todoDueDateSchema().optional(),
    priority: todoPrioritySchema(),
    notes: todoNotesSchema(),
  });
