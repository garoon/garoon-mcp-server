import { z } from "zod";

export const idSchema = () =>
  z.string().describe("Unique identifier as a numeric string (e.g., 12345)");
