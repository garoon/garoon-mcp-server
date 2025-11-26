import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createScheduleEventHandler } from "./handler.js";

export const createScheduleEvent = createTool(
  "garoon-create-schedule-event",
  {
    title: "Create Schedule Event",
    description: "Create a new schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  createScheduleEventHandler,
);
