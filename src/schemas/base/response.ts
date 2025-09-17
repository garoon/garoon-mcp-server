import { z } from "zod";

export const hasNextSchema = () =>
  z
    .boolean()
    .describe(
      "Indicates if the number elements is larger than limit, hasNext is true. Otherwise return false",
    );
