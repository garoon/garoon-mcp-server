import { getCurrentTimeTool } from "./tools/get-current-time/index.js";
import { getGaroonUsersTool } from "./tools/get-garoon-users/index.js";
import { getOrganizationsTool } from "./tools/get-organizations/index.js";
import { getUserInOrganizationTool } from "./tools/get-users-in-organization/index.js";
import type { ToolDefinition } from "#core/register.js";

export const baseTools = [
  getCurrentTimeTool,
  getGaroonUsersTool,
  getOrganizationsTool,
  getUserInOrganizationTool,
] as const satisfies readonly ToolDefinition[];
