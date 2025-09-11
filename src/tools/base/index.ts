import { getCurrentTimeTool } from "./get-current-time/index.js";
import { getGaroonUsersTool } from "./get-garoon-users/index.js";

type BaseTool = typeof getCurrentTimeTool | typeof getGaroonUsersTool;

export const baseTools: BaseTool[] = [getCurrentTimeTool, getGaroonUsersTool];
