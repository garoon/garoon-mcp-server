import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { updateScheduleEventHandler } from "./handler.js";

export const updateScheduleEventTool = createTool(
  "garoon-update-schedule-event",
  {
    title: "Update Schedule Event",
    description: "Update an existing schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  updateScheduleEventHandler,
);
