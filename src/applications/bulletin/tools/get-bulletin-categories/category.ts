import { z } from "zod";
import { idSchema } from "../../../../schemas/index.js";

export const categorySchema = () =>
  z.object({
    id: idSchema().describe(
      "Category unique identifier as a numeric string (e.g., 12345)",
    ),
    name: z.string().describe("Category name"),
    description: z
      .string()
      .nullable()
      .describe("Category memo (null if none exists)"),
    hasSubCategories: z
      .boolean()
      .describe("Whether this category has child categories"),
  });
