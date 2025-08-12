import { Resource } from "../register.js";
import { getCurrentTimeResource } from "./get-current-time.js";
import { timezonesResource } from "./timezones.js";

export const clockResources: Resource[] = [
  getCurrentTimeResource,
  timezonesResource,
];
