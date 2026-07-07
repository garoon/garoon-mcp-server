import { z } from "zod";
import { createStructuredOutputSchema } from "#core/structured-output.js";
import { facilitySchema } from "#applications/schedule/schemas/index.js";
import { idSchema } from "#schemas/index.js";

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
