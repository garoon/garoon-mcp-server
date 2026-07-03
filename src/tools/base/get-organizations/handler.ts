import { z } from "zod";
import { getRequest } from "../../../client.js";
import type { InferToolInput } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getOrganizationsHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { name, limit, offset } = input;

  const params = new URLSearchParams();
  params.append("name", name);

  if (limit !== undefined) {
    params.append("limit", limit.toString());
  }

  if (offset !== undefined) {
    params.append("offset", offset.toString());
  }

  type ResponseType = z.infer<typeof outputSchema.result>;
  return getRequest<ResponseType>(
    `/api/v1/base/organizations?${params.toString()}`,
  );
};
