import { Resource } from "./register.js";
import { usersResources } from "./users/index.js";
import { clockResources } from "./clock/index.js";

export const resources: Resource[] = [...usersResources, ...clockResources];
