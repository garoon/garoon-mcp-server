import { z } from "zod";
import { idSchema, userSchema } from "../../../../schemas/index.js";
import { attachmentSchema } from "./attachment.js";

export const topicDetailSchema = () =>
  z.object({
    id: idSchema().describe(
      "Topic unique identifier as a numeric string (e.g., 12345)",
    ),
    subject: z.string().describe("Topic title"),
    body: z.string().describe("Topic content text or HTML"),
    isHtmlBody: z
      .boolean()
      .describe("Whether the body content is in HTML format"),
    creator: userSchema().describe("User who created the topic"),
    updater: userSchema().describe("User who last updated the topic"),
    manuallySender: z
      .string()
      .optional()
      .describe("Manually entered sender name"),
    createdAt: z.string().describe("Creation datetime in ISO 8601 format"),
    updatedAt: z.string().describe("Last update datetime in ISO 8601 format"),
    acknowledgement: z
      .boolean()
      .describe("Whether reading confirmation is enabled"),
    allowComments: z.boolean().describe("Whether comments are permitted"),
    operatorType: z
      .enum(["ONLY_SENDER", "SELECT_USERS"])
      .describe("Edit/delete permission type"),
    operators: z
      .array(userSchema())
      .describe("Users permitted to edit or delete the topic"),
    attachments: z.array(attachmentSchema()).describe("List of attached files"),
    publicPeriod: z
      .object({
        isUnlimited: z
          .boolean()
          .describe("Whether the publication period is unlimited"),
        start: z
          .string()
          .optional()
          .describe("Publication start datetime in ISO 8601 format"),
        end: z
          .string()
          .optional()
          .describe("Publication end datetime in ISO 8601 format"),
      })
      .describe("Publication period details"),
    isDraft: z.boolean().describe("Whether this topic is a draft"),
    isPublished: z.boolean().describe("Whether the publication has started"),
    isExpired: z.boolean().describe("Whether the publication period has ended"),
    category: z
      .object({
        id: idSchema().describe("Category identifier"),
        name: z.string().describe("Category name"),
      })
      .describe("Category this topic belongs to"),
  });
