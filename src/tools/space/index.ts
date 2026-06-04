import { getSpacesTool } from "./get-spaces/index.js";
import { getSpaceDiscussionsTool } from "./get-space-discussions/index.js";
import { createSpaceDiscussionTool } from "./create-space-discussion/index.js";
import { createDiscussionCommentTool } from "./create-discussion-comment/index.js";

export const spaceTools = [
  getSpacesTool,
  getSpaceDiscussionsTool,
  createSpaceDiscussionTool,
  createDiscussionCommentTool,
];
