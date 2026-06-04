import { z } from "zod";
import {
  messageTitleSchema,
  messageBodySchema,
  messageAcknowledgementSchema,
  messageIsDraftSchema,
  messageIsHtmlBodySchema,
  messageOperatorTypeSchema,
  messageRecipientInputSchema,
  messageOperatorInputSchema,
} from "../shared-schemas/index.js";

export const inputSchema = {
  title: messageTitleSchema(),
  recipients: z
    .array(messageRecipientInputSchema())
    .describe("List of recipients for the message"),
  acknowledgement: messageAcknowledgementSchema().optional().default(false),
  isDraft: messageIsDraftSchema().optional().default(false),
  body: messageBodySchema().optional(),
  isHtmlBody: messageIsHtmlBodySchema().optional().default(false),
  operatorType: messageOperatorTypeSchema().optional(),
  operators: z
    .array(messageOperatorInputSchema())
    .optional()
    .describe("List of operators for the message"),
};
