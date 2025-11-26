import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getGaroonUsersHandler } from "./handler.js";

export const getGaroonUsersTool = createTool(
  "garoon-get-users",
  {
    title: "Get Garoon Users",
    description:
      "Get user data (name, ID, code) from Garoon by searching name/code. IMPORTANT: Omit name parameter for self-referential queries ('me', 'my', 'I', 'myself', 私, 僕, 自分) to return current user info. Supports pagination in Garoon.",
    inputSchema,
    outputSchema,
  },
  getGaroonUsersHandler,
);
