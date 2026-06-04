import { z } from "zod";

export const todoCategoryIdSchema = () =>
  z.number().describe("Unique identifier for the TODO category");

export const todoCategoryNameSchema = () =>
  z.string().describe("Name of the TODO category");

export const todoCategoryItemSchema = () =>
  z.object({
    id: todoCategoryIdSchema(),
    name: todoCategoryNameSchema(),
  });
