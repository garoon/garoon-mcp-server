import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const getUsersInOrganizationHandler = async (
  input: {
    organizationId: string;
    limit?: number;
    offset?: number;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { organizationId, limit, offset } = input;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (limit !== undefined) {
    queryParams.set("limit", limit.toString());
  }
  if (offset !== undefined) {
    queryParams.set("offset", offset.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/api/v1/base/organizations/${encodeURIComponent(organizationId)}/users${queryString ? `?${queryString}` : ""}`;

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
