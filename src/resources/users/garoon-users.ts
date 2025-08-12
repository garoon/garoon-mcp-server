import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { createResource } from "../register.js";
import { getRequest } from "../../client.js";
import { userSchema } from "../../schemas/schedule/common.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";

const outputSchema = createStructuredOutputSchema({
  users: z
    .array(userSchema())
    .describe("List of users matching the name or code"),
});

export const garoonUsersResource = createResource(
  "garoon-users",
  new ResourceTemplate("garoon-users://{name}", {
    list: undefined,
  }),
  {
    title: "Garoon User Data Mapping",
    description: `Get "user id", "user name", and "user code" mapping by a user name or a user code.
Args:
  - name: A searchable display name(e.g., 田中太郎, Sara Brown) or user code(e.g., t-tanaka, user123)
Returns:
  - users[]: List of users matching the name or code
    - users[].id: User's unique ID in Garoon for requesting the API (e.g., 12345)
    - users[].name: User name displayed in screen (e.g., '田中太郎', 'Sara Brown')
    - users[].code: User code used in login (e.g., 'jiro_suzuki', 'user123')
`,
    mimeType: "application/json",
  },
  async (uri, { name }) => {
    const searchName = Array.isArray(name) ? name[0] : name;

    type ResponseType = z.infer<typeof outputSchema.result>;
    const data = await getRequest<ResponseType>(
      `/api/v1/base/users?name=${searchName}`,
    );

    const output = {
      isError: false,
      result: data,
    };
    const validatedOutput = z.object(outputSchema).parse(output);

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(validatedOutput, null, 2),
        },
      ],
    };
  },
);
