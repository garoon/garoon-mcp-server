import { z } from "zod";
import { getRequest } from "../../../client.js";
import type { InferToolInput } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getGaroonUsersHandler = async (
  input: InferToolInput<typeof inputSchema>,
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
  return getRequest<ResponseType>(endpoint);
};
