import { getBulletinCategoriesTool } from "./tools/get-bulletin-categories/index.js";
import { getBulletinTopicsTool } from "./tools/get-bulletin-topics/index.js";
import { getBulletinTopicTool } from "./tools/get-bulletin-topic/index.js";
import type { ToolDefinition } from "#core/register.js";

export const bulletinTools = [
  getBulletinCategoriesTool,
  getBulletinTopicsTool,
  getBulletinTopicTool,
] as const satisfies readonly ToolDefinition[];
