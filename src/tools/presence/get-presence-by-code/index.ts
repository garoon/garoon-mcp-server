import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getPresenceByCodeHandler } from "./handler.js";

export const getPresenceByCodeTool = createTool(
  "garoon-get-presence-by-code",
  {
    title: "Get Presence By Code",
    description:
      "Get presence information (attendance status) for a user by their login name (code).",
    inputSchema,
    outputSchema,
  },
  getPresenceByCodeHandler,
);
