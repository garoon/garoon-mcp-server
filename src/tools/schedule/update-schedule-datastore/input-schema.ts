import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  eventId: idSchema().describe("The ID of the schedule event"),
  customizeName: z
    .string()
    .describe("The customize name (key) of the datastore"),
  value: z
    .record(z.unknown())
    .describe("The datastore value as a key-value object"),
};
