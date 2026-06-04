import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { addScheduleDatastoreHandler } from "./handler.js";

export const addScheduleDatastoreTool = createTool(
  "garoon-add-schedule-datastore",
  {
    title: "Add Schedule Datastore",
    description: "Add custom datastore data for a schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  addScheduleDatastoreHandler,
);
