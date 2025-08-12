import z from "zod";
import { createTool } from "../register.js";
import { getRequest } from "../../client.js";
import { userSchema } from "../../schemas/users/common.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";

const inputSchema = {
  name: z
    .string()
    .describe(
      "A searchable display name(e.g., 田中太郎, Sara Brown) or user code(e.g., t-tanaka, user123)",
    ),
};

const outputSchema = createStructuredOutputSchema({
  users: z
    .array(userSchema())
    .describe("List of users matching the name or code"),
});

export const garoonUsersTool = createTool(
  "get-garoon-users",
  {
    title: "Get Garoon User Data Mapping",
    description:
      "Get User's name, ID, and code data mapping in Garoon by searching a user name or a user code.",
    inputSchema,
    outputSchema,
  },
  async ({ name }) => {
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
          type: "text",
          text: JSON.stringify(validatedOutput, null, 2),
        },
      ],
    };
  },
);
