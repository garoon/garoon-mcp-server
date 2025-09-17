import { z } from "zod";

export const limitSchema = () =>
  z.number().optional().describe("Maximum number of elements to return");

export const offsetSchema = () =>
  z
    .number()
    .optional()
    .describe("Number of element to skip from the beginning");

export const hasNextSchema = () =>
  z
    .boolean()
    .describe(
      "Indicates if the number elements is larger than limit, hasNext is true. Otherwise return false",
    );
