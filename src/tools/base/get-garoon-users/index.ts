import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getGaroonUsersHandler } from "./handler.js";

export const getGaroonUsersTool = createTool(
  "get-garoon-users",
  {
    title: "Get Garoon User Data Mapping",
    description:
      "Get user data (name, ID, code) from Garoon by searching name/code. IMPORTANT: Omit name parameter for self-referential queries ('me', 'my', 'I', 'myself', 私, 僕, 自分) to return current user info. Supports pagination.",
    inputSchema,
    outputSchema,
  },
  getGaroonUsersHandler,
);
