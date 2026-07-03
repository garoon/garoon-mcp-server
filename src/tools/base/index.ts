import { getCurrentTimeTool } from "./get-current-time/index.js";
import { getGaroonUsersTool } from "./get-garoon-users/index.js";
import { getOrganizationsTool } from "./get-organizations/index.js";
import { getUserInOrganizationTool } from "./get-users-in-organization/index.js";
import type { ToolDefinition } from "../register.js";

export const baseTools = [
  getCurrentTimeTool,
  getGaroonUsersTool,
  getOrganizationsTool,
  getUserInOrganizationTool,
] as const satisfies readonly ToolDefinition[];
