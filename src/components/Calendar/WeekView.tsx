import React, { memo, ReactElement } from 'react';
import { ViewProps } from 'react-native';
import WeekWrapper from './WeekWrapper';
import { Week } from '../../utils';
import Day from './Day';

export type WeekViewProps = {
  week: Week;
  onLayout?: ViewProps['onLayout'];
};

function WeekView({ week, onLayout }: WeekViewProps): ReactElement {
  return (
    <WeekWrapper key={week.key} onLayout={onLayout}>
      {week.days.map((day) => (
        <Day key={day.key} day={day} />
      ))}
    </WeekWrapper>
  );
}

export default memo(WeekView);
