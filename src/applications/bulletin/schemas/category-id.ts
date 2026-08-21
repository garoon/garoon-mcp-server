import { z } from "zod";

export const categoryIdSchema = () =>
  z
    .string()
    // Bulletin categories are the only Garoon IDs that can be negative, so the
    // shared idSchema() (positive integers only) cannot be used here.
    .regex(/^(?:-[12]|\d+)$/)
    .describe(
      "Category identifier as a numeric string. Special categories use negative values: -1=pending approval, -2=drafts",
    );
