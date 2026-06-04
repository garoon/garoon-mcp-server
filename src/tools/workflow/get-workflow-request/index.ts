import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getWorkflowRequestHandler } from "./handler.js";

export const getWorkflowRequestTool = createTool(
  "garoon-get-workflow-request",
  {
    title: "Garoon Get Workflow Request",
    description:
      "Get a specific workflow request from Garoon by its request ID.",
    inputSchema,
    outputSchema,
  },
  getWorkflowRequestHandler,
);
