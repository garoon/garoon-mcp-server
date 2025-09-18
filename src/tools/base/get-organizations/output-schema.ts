import { z } from "zod";
import {
  hasNextSchema,
  organizationSchema,
} from "../../../schemas/base/index.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  organizations: z
    .array(organizationSchema())
    .describe("List of organizations matching the search criteria"),
  hasNext: hasNextSchema(),
});
