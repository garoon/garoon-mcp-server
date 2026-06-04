import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { spaceSchema } from "../shared-schemas/index.js";
import { hasNextSchema } from "../../../schemas/base/index.js";

export const outputSchema = createStructuredOutputSchema({
  spaces: z.array(spaceSchema()).describe("List of spaces"),
  hasNext: hasNextSchema(),
});
