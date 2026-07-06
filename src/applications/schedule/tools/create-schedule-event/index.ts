import { defineTool } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createScheduleEventHandler } from "./handler.js";

export const createScheduleEvent = defineTool({
  name: "garoon-create-schedule-event",
  title: "Create Schedule Event",
  description: "Create a new schedule event in Garoon",
  inputSchema,
  outputSchema,
  handler: createScheduleEventHandler,
});
