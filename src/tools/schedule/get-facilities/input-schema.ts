import { z } from "zod";

export const inputSchema = {
  name: z.string().describe("Name of the facilities to search for"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of facilities to return"),
  offset: z
    .number()
    .optional()
    .describe("Number of facilities to skip from the beginning"),
};
