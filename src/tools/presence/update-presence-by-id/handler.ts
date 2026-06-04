import { z } from "zod";
import { patchRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const updatePresenceByIdHandler = async (
  input: {
    userId: string;
    status?: { code: string };
    notes?: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { userId, status, notes } = input;

  const requestBody = {
    ...(status && { status }),
    ...(notes !== undefined && { notes }),
  };

  type ResponseType = NonNullable<
    z.infer<typeof outputSchema.result>
  >["presence"];
  const data = await patchRequest<ResponseType>(
    `/api/v1/presence/users/${encodeURIComponent(userId)}`,
    JSON.stringify(requestBody),
  );

  const output = {
    result: { presence: data },
  };
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
