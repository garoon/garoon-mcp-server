import { z } from "zod";

export const inputSchema = {
  timezone: z
    .string()
    .optional()
    .describe("The IANA timezone name (e.g., 'Asia/Tokyo')"),
};
