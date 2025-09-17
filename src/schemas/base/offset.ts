import { z } from "zod";

export const offsetSchema = () =>
  z
    .number()
    .int()
    .min(0)
    .optional()
    .describe("Number of items to skip for pagination (optional)");
