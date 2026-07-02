import { getBulletinCategoriesTool } from "./get-bulletin-categories/index.js";
import { getBulletinTopicsTool } from "./get-bulletin-topics/index.js";
import { getBulletinTopicTool } from "./get-bulletin-topic/index.js";
import type { ToolDefinition } from "../register.js";

export const bulletinTools = [
  getBulletinCategoriesTool,
  getBulletinTopicsTool,
  getBulletinTopicTool,
] as const satisfies readonly ToolDefinition[];
