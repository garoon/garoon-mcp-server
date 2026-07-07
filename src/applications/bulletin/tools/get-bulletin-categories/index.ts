import { defineTool } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getBulletinCategoriesHandler } from "./handler.js";

export const getBulletinCategoriesTool = defineTool({
  name: "garoon-get-bulletin-categories",
  title: "Garoon Get Bulletin Categories",
  description:
    "Get bulletin board categories from Garoon. Use parentId to browse sub-categories. Special values: 1=root (default), -1=pending approval, -2=drafts.",
  inputSchema,
  outputSchema,
  handler: getBulletinCategoriesHandler,
});
