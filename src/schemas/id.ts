import { z } from "zod";

export const idSchema = () =>
  z
    .string()
    .regex(/^\d+$/)
    .describe("Unique identifier as a numeric string (e.g., 12345)");
