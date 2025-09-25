import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const getGaroonUsersHandler = async (
  input: {
    name?: string;
    limit?: number;
    offset?: number;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { name, limit, offset } = input;

  const queryParams = new URLSearchParams();

  const searchName = name || process.env.GAROON_USERNAME;
  if (searchName) {
    queryParams.append("name", searchName);
  }

  if (limit !== undefined) {
    queryParams.append("limit", limit.toString());
  }

  if (offset !== undefined) {
    queryParams.append("offset", offset.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/api/v1/base/users?${queryString}`
    : `/api/v1/base/users`;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const data = await getRequest<ResponseType>(endpoint);

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
