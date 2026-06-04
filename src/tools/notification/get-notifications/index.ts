import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getNotificationsHandler } from "./handler.js";

export const getNotificationsTool = createTool(
  "garoon-get-notifications",
  {
    title: "Garoon Get Notifications",
    description:
      "Get notification items from Garoon with optional fields, limit, and offset parameters.",
    inputSchema,
    outputSchema,
  },
  getNotificationsHandler,
);
