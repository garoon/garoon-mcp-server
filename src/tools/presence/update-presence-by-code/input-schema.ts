import { z } from "zod";

export const inputSchema = {
  loginName: z
    .string()
    .describe(
      "Login name (code) of the user to update presence information for",
    ),
  status: z
    .object({
      code: z
        .string()
        .describe(
          'Presence status code (e.g., "attend", "absence", or a custom status code)',
        ),
    })
    .optional()
    .describe("Status to set for the user"),
  notes: z
    .string()
    .optional()
    .describe("Notes about the user's presence status"),
};
