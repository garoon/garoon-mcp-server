import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createSpaceDiscussionHandler } from "./handler.js";

export const createSpaceDiscussionTool = createTool(
  "garoon-create-space-discussion",
  {
    title: "Create Space Discussion",
    description: "Create a new discussion in a specific space in Garoon.",
    inputSchema,
    outputSchema,
  },
  createSpaceDiscussionHandler,
);
