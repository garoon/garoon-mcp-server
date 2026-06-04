import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getScheduleEventHandler } from "./handler.js";

export const getScheduleEventTool = createTool(
  "garoon-get-schedule-event",
  {
    title: "Get Schedule Event",
    description: "Get a single schedule event by its ID from Garoon",
    inputSchema,
    outputSchema,
  },
  getScheduleEventHandler,
);
