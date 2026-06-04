import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { deleteBulletinTopicHandler } from "./handler.js";

export const deleteBulletinTopicTool = createTool(
  "garoon-delete-bulletin-topic",
  {
    title: "Delete Bulletin Topic",
    description: "Delete a bulletin board topic in Garoon",
    inputSchema,
    outputSchema,
  },
  deleteBulletinTopicHandler,
);
