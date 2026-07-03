import { baseTools } from "./base/index.js";
import { bulletinTools } from "./bulletin/index.js";
import type { ToolDefinition } from "./register.js";
import { scheduleTools } from "./schedule/index.js";

export const tools: readonly ToolDefinition[] = [
  ...scheduleTools,
  ...baseTools,
  ...bulletinTools,
];
