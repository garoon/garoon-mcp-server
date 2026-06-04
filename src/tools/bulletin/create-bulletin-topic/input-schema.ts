import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";
import { attachmentInputSchema } from "../shared-schemas/index.js";

export const inputSchema = {
  categoryId: idSchema().describe("Category ID to create the topic in"),
  subject: z.string().optional().describe("Subject of the bulletin topic"),
  body: z.string().optional().describe("Body content of the bulletin topic"),
  isHtmlBody: z
    .boolean()
    .default(false)
    .describe("Whether the body is in HTML format"),
  manuallySender: z
    .object({
      id: idSchema().optional().describe("Sender user ID"),
      code: z.string().optional().describe("Sender user code"),
    })
    .optional()
    .describe("Manually specified sender"),
  acknowledgement: z
    .boolean()
    .optional()
    .describe("Whether acknowledgement is required"),
  allowComments: z
    .boolean()
    .optional()
    .describe("Whether comments are allowed"),
  operatorType: z
    .enum(["ONLY_SENDER", "SELECT_USERS"])
    .optional()
    .describe("Operator type: ONLY_SENDER or SELECT_USERS"),
  operators: z
    .array(
      z.object({
        id: idSchema().optional().describe("Operator user ID"),
        code: z.string().optional().describe("Operator user code"),
      }),
    )
    .optional()
    .describe("List of operators (used when operatorType is SELECT_USERS)"),
  attachments: z
    .array(attachmentInputSchema())
    .optional()
    .describe("List of attachments with base64-encoded content"),
  publicPeriod: z
    .object({
      isUnlimited: z
        .boolean()
        .describe("Whether the public period is unlimited"),
      start: z
        .string()
        .optional()
        .describe("Start datetime of the public period"),
      end: z.string().optional().describe("End datetime of the public period"),
    })
    .optional()
    .describe("Public period settings"),
  isDraft: z.boolean().default(false).describe("Whether to save as a draft"),
  mentions: z
    .array(
      z.object({
        id: idSchema().describe("Mentioned entity ID"),
        type: z
          .enum(["USER", "ORGANIZATION", "ROLE"])
          .describe("Type of the mentioned entity"),
      }),
    )
    .optional()
    .describe("List of mentions"),
};
