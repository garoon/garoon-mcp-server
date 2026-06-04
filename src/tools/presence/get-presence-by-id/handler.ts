import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const getPresenceByIdHandler = async (
  input: {
    userId: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { userId } = input;

  type ResponseType = NonNullable<
    z.infer<typeof outputSchema.result>
  >["presence"];
  const data = await getRequest<ResponseType>(
    `/api/v1/presence/users/${encodeURIComponent(userId)}`,
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
