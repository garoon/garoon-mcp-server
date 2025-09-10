import { z } from "zod";
import { postRequest } from "../../../client.js";
import { outputSchema } from "./output-schemas.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

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
  input: {
    subject?: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end?: {
      dateTime: string;
      timeZone: string;
    };
    attendees?: Array<{
      type: "ORGANIZATION" | "USER";
      id?: string;
      code?: string;
    }>;
    eventType?: "REGULAR" | "ALL_DAY";
    eventMenu?: string;
    notes?: string;
    visibilityType?: "PUBLIC" | "PRIVATE";
    facilities?: Array<{
      id?: string;
      code?: string;
    }>;
    facilityUsingPurpose?: string;
    watchers?: Array<{
      type: "ORGANIZATION" | "USER" | "ROLE";
      id?: string;
      code?: string;
    }>;
    isStartOnly?: boolean;
    isAllDay?: boolean;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
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
  const result = await postRequest<ResponseType>(
    endpoint,
    JSON.stringify(requestBody),
  );

  const output = {
    result: result,
  };
  const validatedOutput = z.object(outputSchema).parse(output);

  return {
    structuredContent: validatedOutput,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(validatedOutput, null, 2),
      },
    ],
  };
};
