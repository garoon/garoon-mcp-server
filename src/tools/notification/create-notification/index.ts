import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createNotificationHandler } from "./handler.js";

export const createNotificationTool = createTool(
  "garoon-create-notification",
  {
    title: "Garoon Create Notification",
    description:
      "Create a new notification in Garoon and send it to specified destination users.",
    inputSchema,
    outputSchema,
  },
  createNotificationHandler,
);
