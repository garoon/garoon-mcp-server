import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const attachmentSchema = () =>
  z.object({
    id: idSchema().describe("Attachment file identifier"),
    name: z.string().describe("File name"),
    contentType: z.string().describe("MIME type of the file"),
    size: z.string().describe("File size as a string"),
  });
