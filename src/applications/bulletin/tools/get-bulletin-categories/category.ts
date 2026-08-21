import { z } from "zod";
import { categoryIdSchema } from "#applications/bulletin/schemas/index.js";

export const categorySchema = () =>
  z.object({
    id: categoryIdSchema(),
    name: z.string().describe("Category name"),
    description: z
      .string()
      .nullable()
      .describe("Category memo (null if none exists)"),
    hasSubCategories: z
      .boolean()
      .describe("Whether this category has child categories"),
  });
