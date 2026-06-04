import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getScheduleDatastoreHandler } from "./handler.js";

export const getScheduleDatastoreTool = createTool(
  "garoon-get-schedule-datastore",
  {
    title: "Get Schedule Datastore",
    description: "Get custom datastore data for a schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  getScheduleDatastoreHandler,
);
