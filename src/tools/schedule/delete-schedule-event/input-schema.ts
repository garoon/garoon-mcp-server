import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  eventId: idSchema().describe("The ID of the schedule event to delete"),
};
