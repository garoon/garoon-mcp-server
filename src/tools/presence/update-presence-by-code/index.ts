import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { updatePresenceByCodeHandler } from "./handler.js";

export const updatePresenceByCodeTool = createTool(
  "garoon-update-presence-by-code",
  {
    title: "Update Presence By Code",
    description:
      "Update presence information (attendance status) for a user by their login name (code).",
    inputSchema,
    outputSchema,
  },
  updatePresenceByCodeHandler,
);
