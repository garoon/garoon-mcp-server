import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { deleteScheduleDatastoreHandler } from "./handler.js";

export const deleteScheduleDatastoreTool = createTool(
  "garoon-delete-schedule-datastore",
  {
    title: "Delete Schedule Datastore",
    description: "Delete custom datastore data for a schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  deleteScheduleDatastoreHandler,
);
