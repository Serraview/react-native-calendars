import { CalendarDimensionsCtx } from 'CalendarExample/src/contexts';
import React, { memo, ReactElement, useContext } from 'react';
import { View } from 'react-native';
import { Month } from '../../utils';
import WeekView from './WeekView';

export type MonthViewProps = {
  month: Month;
};

function MonthView({ month }: MonthViewProps): ReactElement {
  const { updateRowHeight } = useContext(CalendarDimensionsCtx);
  return (
    <View>
      {month.weeks.map(
        (week, i): ReactElement => (
          <WeekView
            key={week.key}
            week={week}
            onLayout={i === 0 ? updateRowHeight(month) : undefined}
          />
        )
      )}
    </View>
  );
}

export default memo(MonthView);
