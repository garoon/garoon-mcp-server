import { z } from "zod";

// The bulletin topics endpoint (GET /api/v1/bulletin/categories/{categoryId})
// omits the 1-1000 range in its doc, but the live API was verified on 2026-07-06
// to reject -1 and 1001 and accept 1000, so the shared bound applies there too.
export const limitSchema = () =>
  z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .describe("Maximum number of elements to return");

export const offsetSchema = () =>
  z
    .number()
    .int()
    .min(0)
    .optional()
    .describe("Number of element to skip from the beginning");

export const hasNextSchema = () =>
  z
    .boolean()
    .describe(
      "Indicates if the number elements is larger than limit, hasNext is true. Otherwise return false",
    );
