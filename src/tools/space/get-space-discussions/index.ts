import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getSpaceDiscussionsHandler } from "./handler.js";

export const getSpaceDiscussionsTool = createTool(
  "garoon-get-space-discussions",
  {
    title: "Get Space Discussions",
    description:
      "Get a list of discussions in a specific space with optional limit and offset parameters.",
    inputSchema,
    outputSchema,
  },
  getSpaceDiscussionsHandler,
);
