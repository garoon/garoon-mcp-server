import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { updateScheduleDatastoreHandler } from "./handler.js";

export const updateScheduleDatastoreTool = createTool(
  "garoon-update-schedule-datastore",
  {
    title: "Update Schedule Datastore",
    description: "Update custom datastore data for a schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  updateScheduleDatastoreHandler,
);
