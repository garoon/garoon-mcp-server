import { z } from "zod";
import { idSchema, userSchema } from "../../../../schemas/index.js";

export const topicSummarySchema = () =>
  z.object({
    id: idSchema().describe(
      "Topic unique identifier as a numeric string (e.g., 12345)",
    ),
    subject: z.string().describe("Topic title"),
    updatedAt: z.string().describe("Last update datetime in ISO 8601 format"),
    updater: userSchema().describe("User who last updated the topic"),
    manuallySender: z
      .string()
      .optional()
      .describe("Manually entered sender name"),
  });
