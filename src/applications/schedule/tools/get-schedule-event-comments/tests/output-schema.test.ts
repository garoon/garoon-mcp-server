import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-schedule-event-comments outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate an empty comment list", () => {
    const validOutput = {
      result: { comments: [], hasNext: false },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate a full response (spec example)", () => {
    const validOutput = {
      result: {
        comments: [
          {
            id: "1",
            body: "Please confirm your attendance.",
            createdAt: "2024-04-19T04:46:25Z",
            creator: { id: "4", code: "user1", name: "Aki Tanaka" },
            mentions: [
              { type: "USER", id: "5", code: "user2", name: "Haru Yamada" },
            ],
          },
          {
            id: "2",
            body: "Got it, I will attend.",
            createdAt: "2024-04-19T05:10:00Z",
            creator: { id: "5", code: "user2", name: "Haru Yamada" },
            mentions: [],
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should allow a deleted creator (empty id/code) and ATTENDEES mention", () => {
    const validOutput = {
      result: {
        comments: [
          {
            id: "3",
            body: "See you all there.",
            createdAt: "2024-04-19T06:00:00Z",
            creator: { id: "", code: "", name: "Aki Tanaka(Deleted)" },
            mentions: [
              {
                type: "ATTENDEES",
                id: "attendees",
                code: "",
                name: "Attendees",
              },
            ],
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should reject an invalid mention type", () => {
    const invalidOutput = {
      result: {
        comments: [
          {
            id: "1",
            body: "hi",
            createdAt: "2024-04-19T04:46:25Z",
            creator: { id: "4", code: "user1", name: "Aki Tanaka" },
            mentions: [{ type: "TEAM", id: "1", code: "team1", name: "Team" }],
          },
        ],
        hasNext: false,
      },
    };

    expect(schema.safeParse(invalidOutput).success).toBe(false);
  });
});
