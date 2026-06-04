import { z } from "zod";
import { patchRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

type HandlerInput = {
  topicId: string;
  subject?: string;
  body?: string;
  isHtmlBody?: boolean;
  manuallySender?: { id?: string; code?: string };
  allowComments?: boolean;
  operatorType?: "ONLY_SENDER" | "SELECT_USERS";
  operators?: Array<{ id?: string; code?: string }>;
  attachments?: Array<{ name: string; content: string }>;
  publicPeriod?: { isUnlimited: boolean; start?: string; end?: string };
  isNotified?: boolean;
  mentions?: Array<{ id: string; type: string }>;
};

export const updateBulletinTopicHandler = async (
  input: HandlerInput,
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const endpoint = `/api/v1/bulletin/topics/${input.topicId}`;

  const requestBody: Record<string, unknown> = {};

  if (input.subject !== undefined) requestBody.subject = input.subject;
  if (input.body !== undefined) requestBody.body = input.body;
  if (input.isHtmlBody !== undefined) requestBody.isHtmlBody = input.isHtmlBody;
  if (input.manuallySender !== undefined)
    requestBody.manuallySender = input.manuallySender;
  if (input.allowComments !== undefined)
    requestBody.allowComments = input.allowComments;
  if (input.operatorType !== undefined)
    requestBody.operatorType = input.operatorType;
  if (input.operators !== undefined) requestBody.operators = input.operators;
  if (input.attachments !== undefined)
    requestBody.attachments = input.attachments;
  if (input.publicPeriod !== undefined)
    requestBody.publicPeriod = input.publicPeriod;
  if (input.isNotified !== undefined) requestBody.isNotified = input.isNotified;
  if (input.mentions !== undefined) requestBody.mentions = input.mentions;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const result = await patchRequest<ResponseType>(
    endpoint,
    JSON.stringify(requestBody),
  );

  const output = { result };
  const validatedOutput = z.object(outputSchema).parse(output);

  return {
    structuredContent: validatedOutput,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(validatedOutput, null, 2),
      },
    ],
  };
};
