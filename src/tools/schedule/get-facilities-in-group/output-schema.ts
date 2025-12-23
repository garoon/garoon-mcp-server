import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";
import { facilitySchema } from "../shared-schemas/index.js";
import { idSchema } from "../../../schemas/base/index.js";

export const outputSchema = createStructuredOutputSchema({
  facilities: z
    .array(
      facilitySchema().and(
        z.object({
          facilityGroup: idSchema().describe(
            "ID of the facility group this facility belongs to",
          ),
        }),
      ),
    )
    .describe("List of facilities"),
});
