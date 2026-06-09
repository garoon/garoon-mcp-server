import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  eventId: idSchema().describe("The ID of the schedule event"),
  customizeName: z
    .string()
    .describe(
      "The customize name (key) of the datastore. Only alphanumeric characters and dots are allowed (e.g., 'my.key1'). Underscores and other special characters are not allowed.",
    ),
  value: z
    .record(z.unknown())
    .describe("The datastore value as a key-value object"),
};
