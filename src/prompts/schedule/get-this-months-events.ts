import { z } from "zod";
import { createPrompt } from "../register.js";

const argsSchema = {
  name: z.string().describe("Name of user"),
  lang: z.string().optional().describe('Response language (Default: "日本語")'),
};

export const getThisMonthsEvents = createPrompt(
  "get-this-months-events",
  {
    title: "This month's event",
    description: "Get a user's schedule events for this month",
    argsSchema,
  },
  async ({ name, lang }) => {
    const outputLang = lang || "日本語";
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please tell me this user's events for this month: ${name}
Respond in ${outputLang}`,
          },
        },
      ],
    };
  },
);
