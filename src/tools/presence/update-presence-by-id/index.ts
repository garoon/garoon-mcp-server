import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { updatePresenceByIdHandler } from "./handler.js";

export const updatePresenceByIdTool = createTool(
  "garoon-update-presence-by-id",
  {
    title: "Update Presence By ID",
    description:
      "Update presence information (attendance status) for a user by their user ID.",
    inputSchema,
    outputSchema,
  },
  updatePresenceByIdHandler,
);
