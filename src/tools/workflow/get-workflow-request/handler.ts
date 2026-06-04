import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const getWorkflowRequestHandler = async (
  input: {
    requestId: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { requestId } = input;

  type ResponseType = NonNullable<
    z.infer<typeof outputSchema.result>
  >["request"];
  const data = await getRequest<ResponseType>(
    `/api/v1/workflow/requests/${encodeURIComponent(requestId)}`,
  );

  const output = {
    result: { request: data },
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
