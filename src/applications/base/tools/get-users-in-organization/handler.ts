import { z } from "zod";
import { getRequest } from "#client.js";
import type { InferToolInput } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getUsersInOrganizationHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { organizationId, limit, offset } = input;

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
  return getRequest<ResponseType>(endpoint);
};
