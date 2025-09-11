import { getGaroonUsersTool } from "./get-garoon-users/index.js";

type BaseTool = typeof getGaroonUsersTool;

export const baseUsersTools: BaseTool[] = [getGaroonUsersTool];
