import { z } from "zod";

export const hasNextSchema = () =>
  z
    .boolean()
    .describe(
      "Indicates if there are more elements available (based on limit parameter)",
    );
