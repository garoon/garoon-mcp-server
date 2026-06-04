import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const messageCreatorSchema = () =>
  z.object({
    id: idSchema().describe("Creator user ID"),
    code: z.string().describe("Creator user code"),
    name: z.string().describe("Creator user name"),
  });

export const messageUpdaterSchema = () =>
  z.object({
    id: idSchema().describe("Updater user ID"),
    code: z.string().describe("Updater user code"),
    name: z.string().describe("Updater user name"),
  });

export const messageRecipientSchema = () =>
  z.object({
    id: idSchema().describe("Recipient ID"),
    name: z.string().describe("Recipient name"),
    code: z.string().describe("Recipient code"),
    type: z.string().describe("Recipient type"),
    isAcknowledged: z
      .boolean()
      .optional()
      .describe(
        "Whether the recipient has acknowledged the message (may not be returned on create)",
      ),
  });

export const messageFolderSchema = () =>
  z.object({
    id: idSchema().describe("Folder ID"),
    name: z.string().describe("Folder name"),
    type: z.string().describe("Folder type"),
  });

export const messageOperatorSchema = () =>
  z.object({
    id: idSchema().describe("Operator ID"),
    name: z.string().describe("Operator name"),
    code: z.string().describe("Operator code"),
    type: z.string().describe("Operator type"),
  });

export const messageSchema = () =>
  z.object({
    id: idSchema().describe("Message ID"),
    title: z.string().describe("Message title"),
    acknowledgement: z
      .boolean()
      .describe("Whether acknowledgement is requested"),
    creator: messageCreatorSchema().describe("Message creator"),
    updater: messageUpdaterSchema()
      .optional()
      .describe("Message updater (not returned on create)"),
    createdAt: z.string().describe("Creation datetime"),
    updatedAt: z
      .string()
      .nullable()
      .optional()
      .describe("Last update datetime or null (not returned on create)"),
    recipients: z
      .array(messageRecipientSchema())
      .describe("List of recipients"),
    isDraft: z.boolean().describe("Whether the message is a draft"),
    body: z.string().describe("Message body"),
    isHtmlBody: z.boolean().describe("Whether the body is HTML formatted"),
    folders: z
      .array(messageFolderSchema())
      .optional()
      .describe("List of folders (not returned on create)"),
    operatorType: z
      .string()
      .optional()
      .describe("Operator type (not returned on create)"),
    operators: z
      .array(messageOperatorSchema())
      .optional()
      .describe("List of operators (not returned on create)"),
  });

export const messageTitleSchema = () =>
  z.string().max(100).describe("Message title (max 100 characters)");

export const messageBodySchema = () =>
  z.string().describe("Message body content");

export const messageAcknowledgementSchema = () =>
  z.boolean().describe("Whether to request acknowledgement from recipients");

export const messageIsDraftSchema = () =>
  z.boolean().describe("Whether the message is a draft");

export const messageIsHtmlBodySchema = () =>
  z.boolean().describe("Whether the body is HTML formatted");

export const messageOperatorTypeSchema = () =>
  z
    .enum(["ONLY_SENDER", "SELECT_USERS", "ALL_TO_RECIPIENTS"])
    .describe(
      "Operator type: ONLY_SENDER = only sender can operate, SELECT_USERS = selected users can operate, ALL_TO_RECIPIENTS = all recipients can operate",
    );

export const messageRecipientInputSchema = () =>
  z.object({
    id: idSchema().describe("Recipient user ID"),
    type: z
      .literal("USER")
      .describe("Recipient type (currently only USER is supported)"),
  });

export const messageOperatorInputSchema = () =>
  z.object({
    id: idSchema().describe("Operator user ID"),
    code: z.string().optional().describe("Operator user code"),
    type: z
      .literal("USER")
      .describe("Operator type (currently only USER is supported)"),
  });
