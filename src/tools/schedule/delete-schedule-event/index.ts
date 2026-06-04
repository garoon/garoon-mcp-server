import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { deleteScheduleEventHandler } from "./handler.js";

export const deleteScheduleEventTool = createTool(
  "garoon-delete-schedule-event",
  {
    title: "Delete Schedule Event",
    description: "Delete a schedule event from Garoon",
    inputSchema,
    outputSchema,
  },
  deleteScheduleEventHandler,
);
