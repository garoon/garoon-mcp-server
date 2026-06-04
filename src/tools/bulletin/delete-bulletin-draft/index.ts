import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { deleteBulletinDraftHandler } from "./handler.js";

export const deleteBulletinDraftTool = createTool(
  "garoon-delete-bulletin-draft",
  {
    title: "Delete Bulletin Draft",
    description: "Delete a draft bulletin board topic in Garoon",
    inputSchema,
    outputSchema,
  },
  deleteBulletinDraftHandler,
);
