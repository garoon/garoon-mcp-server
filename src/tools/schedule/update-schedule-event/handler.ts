import { z } from "zod";
import { patchRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
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

export const updateScheduleEventHandler = async (
  input: {
    eventId: string;
    subject?: string;
    notes?: string;
    eventMenu?: string;
    start?: {
      dateTime: string;
      timeZone: string;
    };
    end?: {
      dateTime: string;
      timeZone: string;
    };
    isAllDay?: boolean;
    isStartOnly?: boolean;
    attendees?: Array<{
      type: "ORGANIZATION" | "USER";
      id?: string;
      code?: string;
    }>;
    facilities?: Array<{
      id?: string;
      code?: string;
    }>;
    facilityUsingPurpose?: string;
    visibilityType?: "PUBLIC" | "PRIVATE";
    watchers?: Array<{
      type: "ORGANIZATION" | "USER" | "ROLE";
      id?: string;
      code?: string;
    }>;
    companyInfo?: {
      name?: string;
      zipCode?: string;
      address?: string;
      route?: string;
      routeTime?: string;
      routeFare?: string;
      phone?: string;
    };
    useAttendanceCheck?: boolean;
    notifyAttendees?: boolean;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { eventId, ...rest } = input;

  const requestBody: Record<string, unknown> = {};

  if (rest.subject !== undefined) requestBody.subject = rest.subject;
  if (rest.notes !== undefined) requestBody.notes = rest.notes;
  if (rest.eventMenu !== undefined) requestBody.eventMenu = rest.eventMenu;
  if (rest.start !== undefined) requestBody.start = rest.start;
  if (rest.end !== undefined) requestBody.end = rest.end;
  if (rest.isAllDay !== undefined) requestBody.isAllDay = rest.isAllDay;
  if (rest.isStartOnly !== undefined)
    requestBody.isStartOnly = rest.isStartOnly;
  if (rest.visibilityType !== undefined)
    requestBody.visibilityType = rest.visibilityType;
  if (rest.facilityUsingPurpose !== undefined)
    requestBody.facilityUsingPurpose = rest.facilityUsingPurpose;
  if (rest.companyInfo !== undefined)
    requestBody.companyInfo = rest.companyInfo;
  if (rest.useAttendanceCheck !== undefined)
    requestBody.useAttendanceCheck = rest.useAttendanceCheck;
  if (rest.notifyAttendees !== undefined)
    requestBody.notifyAttendees = rest.notifyAttendees;

  if (rest.attendees !== undefined) {
    requestBody.attendees = rest.attendees.map((attendee) =>
      hasAttendeeId(attendee)
        ? { type: attendee.type, id: attendee.id }
        : { type: attendee.type, code: attendee.code },
    );
  }

  if (rest.facilities !== undefined) {
    requestBody.facilities = rest.facilities.map((facility) =>
      hasFacilityId(facility) ? { id: facility.id } : { code: facility.code },
    );
  }

  if (rest.watchers !== undefined) {
    requestBody.watchers = rest.watchers.map((watcher) =>
      hasWatcherId(watcher)
        ? { type: watcher.type, id: watcher.id }
        : { type: watcher.type, code: watcher.code },
    );
  }

  const endpoint = `/api/v1/schedule/events/${encodeURIComponent(eventId)}`;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const result = await patchRequest<ResponseType>(
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
