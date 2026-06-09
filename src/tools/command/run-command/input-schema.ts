import { z } from "zod";

export const inputSchema = {
  endpoint: z
    .string()
    .describe(
      "The command endpoint path relative to the Garoon base URL (e.g., 'schedule/command_delete.csp')",
    ),
  params: z
    .record(z.string(), z.string())
    .optional()
    .describe(
      "Key-value parameters to send with the POST request. Do not include csrf_ticket — it is added automatically.",
    ),
};
