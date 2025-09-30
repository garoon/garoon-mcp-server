import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-schedule-events output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with complete events", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            eventType: "REGULAR",
            eventMenu: "Meeting",
            subject: "Test Event",
            notes: "Test notes",
            visibilityType: "PUBLIC",
            isStartOnly: false,
            isAllDay: false,
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T11:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            attendees: [
              {
                id: "user1",
                code: "user1_code",
                name: "User One",
                type: "USER",
              },
            ],
            facilities: [
              {
                id: "room1",
                code: "room1_code",
                name: "Conference Room 1",
              },
            ],
            facilityUsingPurpose: "Meeting purpose",
            watchers: [
              {
                id: "watcher1",
                code: "watcher1_code",
                name: "Watcher One",
                type: "USER",
              },
            ],
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate minimal output with basic events", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            subject: "Minimal Event",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty events result", () => {
    const validOutput = {
      result: {
        events: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate multiple events with pagination", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            subject: "Event 1",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            id: "2",
            subject: "Event 2",
            start: {
              dateTime: "2024-01-01T14:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T15:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            id: "3",
            eventType: "ALL_DAY",
            subject: "All Day Event",
            isAllDay: true,
            start: {
              dateTime: "2024-01-02T00:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-02T23:59:59+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate start-only events", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            subject: "Start Only Event",
            isStartOnly: true,
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate all-day events", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            eventType: "ALL_DAY",
            subject: "Holiday",
            isAllDay: true,
            start: {
              dateTime: "2024-01-01T00:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T23:59:59+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate events with different types and configurations", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            eventType: "REGULAR",
            eventMenu: "Meeting",
            subject: "Regular Meeting",
            visibilityType: "PUBLIC",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T11:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            id: "2",
            eventType: "ALL_DAY",
            subject: "Private Holiday",
            visibilityType: "PRIVATE",
            isAllDay: true,
            start: {
              dateTime: "2024-01-02T00:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-02T23:59:59+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
          {
            id: "3",
            subject: "Start Only Task",
            isStartOnly: true,
            start: {
              dateTime: "2024-01-03T09:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate events with attendees and facilities", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            subject: "Team Meeting",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            end: {
              dateTime: "2024-01-01T11:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            attendees: [
              {
                id: "1",
                code: "admin",
                name: "Administrator",
                type: "USER",
              },
              {
                id: "2",
                code: "sales",
                name: "Sales Team",
                type: "ORGANIZATION",
              },
            ],
            facilities: [
              {
                id: "1",
                code: "room_a",
                name: "Conference Room A",
              },
            ],
            facilityUsingPurpose: "Weekly team meeting",
            watchers: [
              {
                id: "3",
                code: "manager",
                name: "Manager",
                type: "USER",
              },
            ],
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate events with empty arrays for optional fields", () => {
    const validOutput = {
      result: {
        events: [
          {
            id: "1",
            subject: "Simple Event",
            start: {
              dateTime: "2024-01-01T10:00:00+09:00",
              timeZone: "Asia/Tokyo",
            },
            attendees: [],
            facilities: [],
            watchers: [],
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate error output", () => {
    const validOutput = {
      error: "User not found",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should accept empty object", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
  });

  it("should reject invalid event structure", () => {
    const invalidOutputs = [
      {
        result: {
          events: [
            {
              id: 123,
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              eventType: "INVALID",
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              visibilityType: "INVALID",
            },
          ],
          hasNext: false,
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should reject invalid datetime structure", () => {
    const invalidOutputs = [
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
              },
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: "invalid-start-structure",
            },
          ],
          hasNext: false,
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should reject invalid nested object structure", () => {
    const invalidOutputs = [
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              attendees: [
                {
                  id: "1",
                  type: "USER",
                },
              ],
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              facilities: [
                {
                  id: "1",
                },
              ],
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          events: [
            {
              id: "1",
              subject: "Test Event",
              start: {
                dateTime: "2024-01-01T10:00:00+09:00",
                timeZone: "Asia/Tokyo",
              },
              watchers: [
                {
                  id: "1",
                  code: "watcher1",
                },
              ],
            },
          ],
          hasNext: false,
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should reject invalid result structure", () => {
    const invalidOutputs = [
      {
        result: {
          events: "invalid",
          hasNext: false,
        },
      },
      {
        result: {
          events: [],
          hasNext: "invalid",
        },
      },
      {
        result: {
          events: [],
        },
      },
      {
        result: {
          hasNext: false,
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });
});
