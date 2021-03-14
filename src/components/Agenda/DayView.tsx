// import { differenceInMinutes } from 'date-fns';
import React, { memo, ReactElement, ReactNode, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import invariant from 'ts-invariant';
import {
  AgendaControllerCtx,
  AgendaControlOnItemEventPressed,
} from '../../contexts';
import { renderCustom } from '../../utils/renderHelpers';
import { Day } from '../../utils';
import { ParsedCalendarEvent, RenderProp } from '../../utils/types';

export type DayViewProps = {
  day: Day;
  events?: ParsedCalendarEvent[];
  // renderer?: RenderProp;
  // eventRenderer?: RenderProp;
};

export type AgendaItemEventRendererProps = ParsedCalendarEvent & {
  duration: number;
};

export type AgendaItemRenderProps = Day & {
  events?: ParsedCalendarEvent[];
  eventRenderer?: RenderProp;
  onPress?: AgendaControlOnItemEventPressed;
};

type AgendaItemEventRenderProps = {
  event: ParsedCalendarEvent;
  renderer?: RenderProp;
  onPress?: AgendaControlOnItemEventPressed;
};

const renderEvent = ({
  event,
  renderer,
  onPress,
}: AgendaItemEventRenderProps): ReactNode => {
  const { title, duration, key, multiday } = event;

  if (renderer)
    return renderCustom(renderer, {
      ...event,
      duration,
    } as AgendaItemEventRendererProps);

  return (
    <TouchableOpacity
      key={key}
      style={{
        height: (1 * duration) / (duration > 300 ? 15 : 2) + 30,
        padding: 5,
        backgroundColor: multiday ? 'orange' : 'blue',
        marginHorizontal: 1,
        borderRadius: 8,
      }}
      disabled={!onPress}
      onPress={(): void => {
        if (onPress) onPress(event);
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

function DayView({ day, events = [] }: DayViewProps): ReactElement | null {
  const {
    props: { itemRenderer, eventRenderer, onItemPressed, onItemEventPressed },
  } = useContext(AgendaControllerCtx);
  if (itemRenderer)
    return renderCustom(itemRenderer, {
      ...day,
      events,
      eventRenderer,
    } as AgendaItemRenderProps);

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomColor: '#666',
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
      disabled={!onItemPressed}
      onPress={(): void => {
        if (onItemPressed) onItemPressed({ ...day, events });
      }}
    >
      <View>
        <Text style={{ fontSize: 20, color: '#888' }}>{day.label}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        {events &&
          events.map((event) =>
            renderEvent({
              event,
              renderer: eventRenderer,
              onPress: onItemEventPressed,
            })
          )}
      </View>
    </TouchableOpacity>
  );
}

export default memo(DayView);
