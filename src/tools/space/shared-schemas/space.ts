import { z } from "zod";
import { idSchema, userSchema } from "../../../schemas/base/index.js";

export const spaceCategorySchema = () =>
  z.object({
    id: idSchema().describe("Category unique identifier"),
    name: z.string().describe("Category name"),
  });

export const spaceSchema = () =>
  z.object({
    id: idSchema().describe("Space unique identifier"),
    name: z.string().describe("Space name"),
    isPublic: z.boolean().describe("Whether the space is public"),
    category: spaceCategorySchema()
      .optional()
      .describe("Category the space belongs to"),
    creator: userSchema().optional().describe("User who created the space"),
    updater: userSchema()
      .optional()
      .describe("User who last updated the space"),
    createdAt: z.string().optional().describe("Creation date and time"),
    updatedAt: z.string().optional().describe("Last update date and time"),
  });
