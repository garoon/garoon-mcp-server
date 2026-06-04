import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getPresenceByIdHandler } from "./handler.js";

export const getPresenceByIdTool = createTool(
  "garoon-get-presence-by-id",
  {
    title: "Get Presence By ID",
    description:
      "Get presence information (attendance status) for a user by their user ID.",
    inputSchema,
    outputSchema,
  },
  getPresenceByIdHandler,
);
