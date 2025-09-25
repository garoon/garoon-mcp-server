import { z } from "zod";
import { limitSchema, offsetSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  name: z
    .string()
    .optional()
    .describe(
      "A searchable display name or user code. IMPORTANT: Omit for self-referential queries ('me', 'my', 'I', 'myself', 私, 僕, 自分) to return current user info.",
    ),
  limit: limitSchema().describe("Maximum number of users to return (optional)"),
  offset: offsetSchema().describe(
    "Number of users to skip from the beginning (optional)",
  ),
};
