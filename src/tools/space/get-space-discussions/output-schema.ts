import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { discussionSchema } from "../shared-schemas/index.js";
import { hasNextSchema } from "../../../schemas/base/index.js";

export const outputSchema = createStructuredOutputSchema({
  discussions: z.array(discussionSchema()).describe("List of discussions"),
  hasNext: hasNextSchema(),
});
