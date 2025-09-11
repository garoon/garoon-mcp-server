import { z } from "zod";

export const timeIntervalSchema = () =>
  z
    .number()
    .describe(
      "Time interval in minutes (e.g., 30 for 30-minutes slot, min 1, max 1439 minutes = 23h59m)",
    );
