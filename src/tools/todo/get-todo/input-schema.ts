import { z } from "zod";

export const inputSchema = {
  todoId: z.string().describe("The ID of the TODO item to retrieve"),
};
