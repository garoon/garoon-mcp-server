import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const getFacilitiesHandler = async (
  input: {
    name: string;
    limit?: number;
    offset?: number;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { name, limit, offset } = input;

  const params = new URLSearchParams({
    name: name,
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() }),
  });

  type ResponseType = z.infer<typeof outputSchema.result>;
  const data = await getRequest<ResponseType>(
    `/api/v1/schedule/facilities?${params.toString()}`,
  );

  const output = {
    result: data,
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
