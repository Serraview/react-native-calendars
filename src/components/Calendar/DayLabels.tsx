import React, { memo, ReactElement } from 'react';
import { Text } from 'react-native';
import {
  getWeekDaysFromIndex,
  getShortName,
  TWeekDayIndexes,
} from '../../utils';
import WeekWrapper from './WeekWrapper';

export type DayLabelsProps = {
  startingDayIndex: number;
  keyExtender: string;
};

function DayLabels({
  startingDayIndex,
  keyExtender,
}: DayLabelsProps): ReactElement {
  return (
    <WeekWrapper>
      {getWeekDaysFromIndex(startingDayIndex as TWeekDayIndexes).map((day) => {
        return (
          <Text
            style={{ flex: 1, alignItems: 'center', textAlign: 'center' }}
            key={`week_names_${day}_${keyExtender}`}
          >
            {getShortName(day)}
          </Text>
        );
      })}
    </WeekWrapper>
  );
}

export default memo(DayLabels);
