import { createTool } from "../../register.js";
import { inputSchema } from "./input-schemas.js";
import { outputSchema } from "./output-schemas.js";
import { getGaroonUsersHandler } from "./handler.js";

export const getGaroonUsersTool = createTool(
  "get-garoon-users",
  {
    title: "Get Garoon User Data Mapping",
    description:
      "Get User's name, ID, and code data mapping in Garoon by searching a user name or a user code.",
    inputSchema,
    outputSchema,
  },
  getGaroonUsersHandler,
);
