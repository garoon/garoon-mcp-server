import { z } from "zod";
import { postRequest } from "#client.js";
import type { InferToolInput } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

function hasAttendeeId(attendee: {
  id?: string;
  code?: string;
}): attendee is { id: string } {
  return "id" in attendee && attendee.id !== undefined;
}

function hasFacilityId(facility: { id?: string; code?: string }): facility is {
  id: string;
} {
  return "id" in facility && facility.id !== undefined;
}

function hasWatcherId(watcher: {
  id?: string;
  code?: string;
}): watcher is { id: string } {
  return "id" in watcher && watcher.id !== undefined;
}

export const createScheduleEventHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const {
    subject,
    start,
    end,
    attendees,
    eventType,
    eventMenu,
    notes,
    visibilityType,
    facilities,
    facilityUsingPurpose,
    watchers,
    isStartOnly,
    isAllDay,
  } = input;

  const endpoint = "/api/v1/schedule/events";
  const requestBody = {
    eventType: eventType,
    subject: subject,
    visibilityType: visibilityType,
    start: {
      dateTime: start.dateTime,
      timeZone: start.timeZone,
    },
    ...(end && {
      end: {
        dateTime: end.dateTime,
        timeZone: end.timeZone,
      },
    }),
    isStartOnly: isStartOnly,
    isAllDay: isAllDay,
    attendees: attendees?.map((attendee) =>
      hasAttendeeId(attendee)
        ? {
            type: attendee.type,
            id: attendee.id,
          }
        : {
            type: attendee.type,
            code: attendee.code,
          },
    ),
    ...(eventMenu && { eventMenu }),
    ...(notes && { notes }),
    ...(facilities && {
      facilities: facilities.map((facility) =>
        hasFacilityId(facility) ? { id: facility.id } : { code: facility.code },
      ),
    }),
    ...(facilityUsingPurpose && { facilityUsingPurpose }),
    ...(watchers && {
      watchers: watchers.map((watcher) =>
        hasWatcherId(watcher)
          ? {
              type: watcher.type,
              id: watcher.id,
            }
          : {
              type: watcher.type,
              code: watcher.code,
            },
      ),
    }),
  };

  type ResponseType = z.infer<typeof outputSchema.result>;
  return postRequest<ResponseType>(endpoint, JSON.stringify(requestBody));
};
