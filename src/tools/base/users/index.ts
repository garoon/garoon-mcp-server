import { Tool } from "../../register.js";
import { getGaroonUsersTool } from "./get-garoon-users/index.js";

export const baseUsersTools: Array<Tool<any, any>> = [getGaroonUsersTool];
