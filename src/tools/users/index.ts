import { Tool } from "../register.js";
import { garoonUsersTool } from "./get-garoon-users/index.js";

export const usersTools: Array<Tool<any, any>> = [garoonUsersTool];
