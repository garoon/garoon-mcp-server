import { Tool } from "../register.js";
import { getGaroonUsersTool } from "../base/users/get-garoon-users/index.js";

export const usersTools: Array<Tool<any, any>> = [getGaroonUsersTool];
