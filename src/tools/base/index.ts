import { getCurrentTimeTool } from "./get-current-time/index.js";
import { getGaroonUsersTool } from "./get-garoon-users/index.js";
import { getUserInOrganizationTool } from "./get-users-in-organization/index.js";

export const baseTools = [
  getCurrentTimeTool,
  getGaroonUsersTool,
  getUserInOrganizationTool,
];
