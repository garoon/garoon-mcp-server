import { createTool } from "../../register.js";
import { inputSchema } from "./input-schemas.js";
import { outputSchema } from "./output-schemas.js";
import { createScheduleEventHandler } from "./handler.js";

export const createScheduleEvent = createTool(
  "create-schedule-event",
  {
    title: "Create Schedule Event",
    description: "Create a new schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  createScheduleEventHandler,
);
