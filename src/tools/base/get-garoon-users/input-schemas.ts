import { z } from "zod";

export const inputSchema = {
  name: z
    .string()
    .describe(
      "A searchable display name(e.g., 田中太郎, Sara Brown) or user code(e.g., t-tanaka, user123)",
    ),
};
