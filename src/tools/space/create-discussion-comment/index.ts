import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createDiscussionCommentHandler } from "./handler.js";

export const createDiscussionCommentTool = createTool(
  "garoon-create-discussion-comment",
  {
    title: "Create Discussion Comment",
    description:
      "Create a new comment on a discussion in a specific space in Garoon.",
    inputSchema,
    outputSchema,
  },
  createDiscussionCommentHandler,
);
