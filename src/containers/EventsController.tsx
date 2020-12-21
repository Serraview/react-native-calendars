import {
  addDays,
  differenceInCalendarDays,
  differenceInMinutes,
  endOfDay,
  isSameDay,
  startOfDay,
} from 'date-fns';
import React, { useCallback, useState, useEffect, ReactElement } from 'react';
import invariant from 'ts-invariant';
import { EventsControllerCtx } from '../contexts';
import { CalendarEvent, Callback, ParsedCalendarEvent } from '../utils/types';

export type EventsControllerProps = {
  events: CalendarEvent[];
};

async function parseEvents(
  events: CalendarEvent[],
  cb: Callback<Map<number, ParsedCalendarEvent[]>>
): Promise<void> {
  const out = new Map<number, ParsedCalendarEvent[]>();
  events.forEach((event): void => {
    const {
      duration: predefinedDuration,
      startTime,
      endTime,
      allDay,
      title,
    } = event;
    let duration = predefinedDuration || 0; // in minutes

    // parse duration if one is not provided
    if (!duration) {
      if (allDay) duration = 24 * 60;
      else {
        invariant(
          endTime,
          "If event is not 'allDay', endTime or duration should be provided"
        );
        differenceInMinutes(startTime, endTime);
      }
    }

    // check multiday
    let multiday = false;
    if (endTime && !isSameDay(startTime, endTime)) {
      multiday = true;
    }

    let keys = [startOfDay(startTime).getTime()];

    if (endTime) {
      keys = new Array(differenceInCalendarDays(endTime, startTime) + 1)
        .fill(0)
        .map((_, i) => {
          return startOfDay(addDays(startTime, i)).getTime();
        });
    }

    keys.forEach((key) => {
      const finalEvent: ParsedCalendarEvent = {
        ...event,
        duration,
        multiday,
        key: `${title}_${startTime.getTime()}_${duration}_${key}`,
      };
      if (!out.get(key)) out.set(key, []);
      if (finalEvent.multiday) {
        if (isSameDay(new Date(key), startTime)) {
          // this is the first day of the multiday event
          // adjust duration from start till the end of the day
          finalEvent.duration = differenceInMinutes(
            endOfDay(startTime),
            startTime
          );
        } else if (endTime && isSameDay(new Date(key), endTime)) {
          // last day, so we go from start of the day till endTime
          finalEvent.duration = differenceInMinutes(
            endTime,
            startOfDay(endTime)
          );
        } else {
          // since this is multiday everything else is allDay
          finalEvent.duration = 24 * 60;
        }
      }
      out.get(key)?.push(finalEvent);
    });
  });
  cb(out);
}

export function EventsController({
  events,
  children,
}: EventsControllerProps & IBaseProps): ReactElement {
  const [mappedEvents, setMappedEvents] = useState<
    Map<number, ParsedCalendarEvent[]>
  >(new Map());

  useEffect(() => {
    invariant(
      Array.isArray(events),
      `Props events should be an array, got: ${typeof events}`
    );
    parseEvents(events, setMappedEvents);
  }, [events]);

  const getEventsForDate = useCallback(
    (date: Date): ParsedCalendarEvent[] => {
      if (mappedEvents.size === 0) return [];
      const key = startOfDay(date).getTime();

      return mappedEvents.get(key) || [];
    },
    [mappedEvents]
  );

  return (
    <EventsControllerCtx.Provider value={{ getEventsForDate }}>
      {children}
    </EventsControllerCtx.Provider>
  );
}
