import { z } from "zod";

export const limitSchema = () =>
  z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .describe("Maximum number of items to return (optional)");
