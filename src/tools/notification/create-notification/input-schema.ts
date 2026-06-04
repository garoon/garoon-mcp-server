import { z } from "zod";
import {
  notificationAppSchema,
  notificationKeySchema,
  notificationOperationSchema,
  notificationUrlSchema,
  notificationTitleSchema,
  notificationBodySchema,
  notificationIconSchema,
  notificationDestinationSchema,
} from "../shared-schemas/index.js";

export const inputSchema = {
  app: notificationAppSchema().describe(
    "Application identifier for the notification (required)",
  ),
  notificationKey: notificationKeySchema().describe(
    "Notification key to identify the notification (required)",
  ),
  operation: notificationOperationSchema().describe(
    "Operation type of the notification: add, modify, or remove (required)",
  ),
  url: notificationUrlSchema().describe(
    "URL associated with the notification (required)",
  ),
  title: notificationTitleSchema().describe(
    "Title of the notification (required)",
  ),
  body: notificationBodySchema().describe(
    "Body content of the notification (required)",
  ),
  icon: notificationIconSchema()
    .optional()
    .describe("Icon URL for the notification"),
  destinations: z
    .array(notificationDestinationSchema())
    .describe(
      "Array of destination users for the notification. Each destination requires type 'USER' and either id or code",
    ),
};
