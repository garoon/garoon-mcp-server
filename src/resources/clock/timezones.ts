import z from "zod";
import { createResource } from "../register.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { GAROON_SUPPORTED_TIMEZONES } from "../../constants.js";

const outputSchema = createStructuredOutputSchema({
  timezones: z
    .array(z.string())
    .describe("List of supported timezone identifiers in Garoon"),
});

export const timezonesResource = createResource(
  "garoon-supported-timezones",
  "timezone://list",
  {
    title: "Garoon Supported Timezones",
    description:
      "Get the list of timezone identifiers supported by Garoon.  (e.g., 'Asia/Tokyo', 'America/New_York')",
    mimeType: "application/json",
  },
  async (uri) => {
    const output = {
      isError: false,
      result: {
        timezones: GAROON_SUPPORTED_TIMEZONES,
      },
    };
    const validatedOutput = z.object(outputSchema).parse(output);

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(validatedOutput, null, 2),
        },
      ],
    };
  },
);
