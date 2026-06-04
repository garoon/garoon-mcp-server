import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getBulletinTopicsHandler } from "./handler.js";

export const getBulletinTopicsTool = createTool(
  "garoon-get-bulletin-topics",
  {
    title: "Garoon Get Bulletin Topics",
    description:
      "Get bulletin board topics in a specific category from Garoon. Returns topic summaries with subject, updater, and update time.",
    inputSchema,
    outputSchema,
  },
  getBulletinTopicsHandler,
);
