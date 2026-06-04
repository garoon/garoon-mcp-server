import { z } from "zod";

export const notificationModuleIdSchema = () =>
  z.string().describe("Module ID of the notification");

export const notificationKeySchema = () =>
  z.string().describe("Notification key to identify the notification");

export const notificationOperationSchema = () =>
  z
    .enum(["add", "modify", "remove"])
    .describe("Operation type of the notification (add, modify, or remove)");

export const notificationUrlSchema = () =>
  z.string().describe("URL associated with the notification");

export const notificationTitleSchema = () =>
  z.string().describe("Title of the notification");

export const notificationBodySchema = () =>
  z.string().describe("Body content of the notification");

export const notificationIconSchema = () =>
  z.string().describe("Icon URL for the notification");

export const notificationIsReadSchema = () =>
  z.boolean().describe("Whether the notification has been read");

export const notificationCreatorSchema = () =>
  z.object({
    id: z.string().describe("Creator user ID"),
    code: z.string().describe("Creator user code"),
    name: z.string().describe("Creator user display name"),
  });

export const notificationCreatedAtSchema = () =>
  z.string().describe("Creation timestamp of the notification");

export const notificationAppSchema = () =>
  z.string().describe("Application identifier for the notification");

export const notificationDestinationSchema = () =>
  z.object({
    type: z
      .literal("USER")
      .describe("Destination type (currently only USER is supported)"),
    id: z.number().optional().describe("User ID of the destination"),
    code: z.string().optional().describe("User code of the destination"),
  });

export const notificationItemSchema = () =>
  z.object({
    moduleId: notificationModuleIdSchema(),
    creator: notificationCreatorSchema(),
    createdAt: notificationCreatedAtSchema(),
    operation: notificationOperationSchema(),
    url: notificationUrlSchema(),
    title: notificationTitleSchema(),
    body: notificationBodySchema(),
    icon: notificationIconSchema(),
    isRead: notificationIsReadSchema(),
  });

export const createdNotificationSchema = () =>
  z.object({
    moduleId: notificationModuleIdSchema(),
    notificationKey: notificationKeySchema(),
    creator: notificationCreatorSchema(),
    createdAt: notificationCreatedAtSchema(),
    operation: notificationOperationSchema(),
    url: notificationUrlSchema(),
    title: notificationTitleSchema(),
    body: notificationBodySchema(),
    icon: notificationIconSchema(),
    isRead: notificationIsReadSchema(),
  });
