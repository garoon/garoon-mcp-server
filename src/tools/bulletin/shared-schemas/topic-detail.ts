import { z } from "zod";
import { idSchema, userSchema } from "../../../schemas/base/index.js";
import { attachmentSchema } from "./attachment.js";

export const mentionSchema = () =>
  z.object({
    id: idSchema().describe("Mentioned entity ID"),
    type: z
      .enum(["USER", "ORGANIZATION", "ROLE"])
      .describe("Type of the mentioned entity"),
  });

export const operatorSchema = () =>
  z.object({
    id: idSchema().optional().describe("Operator user ID"),
    code: z.string().optional().describe("Operator user code"),
    name: z.string().optional().describe("Operator user name"),
  });

export const publicPeriodSchema = () =>
  z.object({
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
  });

export const topicDetailSchema = () =>
  z.object({
    id: idSchema().describe(
      "Topic unique identifier as a numeric string (e.g., 12345)",
    ),
    subject: z.string().optional().describe("Topic title"),
    body: z.string().optional().describe("Topic content text or HTML"),
    isHtmlBody: z
      .boolean()
      .optional()
      .describe("Whether the body content is in HTML format"),
    creator: userSchema().optional().describe("User who created the topic"),
    updater: userSchema()
      .optional()
      .describe("User who last updated the topic"),
    manuallySender: z
      .string()
      .optional()
      .describe("Manually entered sender name"),
    createdAt: z
      .string()
      .optional()
      .describe("Creation datetime in ISO 8601 format"),
    updatedAt: z
      .string()
      .optional()
      .describe("Last update datetime in ISO 8601 format"),
    acknowledgement: z
      .boolean()
      .optional()
      .describe("Whether reading confirmation is enabled"),
    allowComments: z
      .boolean()
      .optional()
      .describe("Whether comments are permitted"),
    operatorType: z
      .enum(["ONLY_SENDER", "SELECT_USERS"])
      .optional()
      .describe("Edit/delete permission type"),
    operators: z
      .array(operatorSchema())
      .optional()
      .describe("Users permitted to edit or delete the topic"),
    attachments: z
      .array(attachmentSchema())
      .optional()
      .describe("List of attached files"),
    publicPeriod: publicPeriodSchema()
      .optional()
      .describe("Publication period details"),
    isDraft: z.boolean().optional().describe("Whether this topic is a draft"),
    isPublished: z
      .boolean()
      .optional()
      .describe("Whether the publication has started"),
    isExpired: z
      .boolean()
      .optional()
      .describe("Whether the publication period has ended"),
    category: z
      .object({
        id: idSchema().describe("Category identifier"),
        name: z.string().describe("Category name"),
      })
      .optional()
      .describe("Category this topic belongs to"),
    mentions: z.array(mentionSchema()).optional().describe("List of mentions"),
  });
