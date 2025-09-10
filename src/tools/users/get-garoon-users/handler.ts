import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schemas.js";

export const getGaroonUsersHandler = async (input: { name: string }) => {
  const { name } = input;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const data = await getRequest<ResponseType>(
    `/api/v1/base/users?name=${encodeURIComponent(name)}`,
  );

  const output = {
    isError: false,
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
