import { AgendaControllerCtx, EventsControllerCtx } from 'CalendarExample/src/contexts';
import { Day } from 'CalendarExample/src/utils';
import React, { ReactElement, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DayView, { DayViewProps } from './DayView';

type AgendaItemProps = {
  index: number;
  item: Day
};

export default function ({ item, index }: AgendaItemProps): ReactElement {
  const { listController } = useContext(AgendaControllerCtx);
  const { getEventsForDate } = useContext(EventsControllerCtx);

  return (
    <View onLayout={listController?.onLayoutForIndex(index)}>
      <DayView
        day={item}
        events={getEventsForDate(item.date)}
      />
    </View>
  );
}
