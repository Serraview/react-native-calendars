import React, { memo, ReactElement, useContext, useState } from 'react';
import { TouchableOpacity, Text, PressableProps } from 'react-native';
import { isSameDay } from 'date-fns';
import { Day, isWithinInterval } from '../../utils';
import { DayControllerCtx } from '../../contexts';

type OwnProps = {
  day: Day;
};

type OtherProps = Omit<PressableProps, keyof OwnProps>;

export type DayProps = OwnProps & OtherProps;

function DayView({ day }: DayProps): ReactElement {
  const { selectedDate, minDate, maxDate, setSelectedDate } = useContext(
    DayControllerCtx
  );
  const [isSelectable] = useState(isWithinInterval(day.date, minDate, maxDate));
  const isSelected = isSameDay(day.date, selectedDate);

  return (
    <TouchableOpacity
      style={[
        { flex: 1, alignItems: 'center' },
        isSelected ? { backgroundColor: '#99ffdd', borderRadius: 50 } : {},
      ]}
      // {...other}
      onPress={(): void => {
        setSelectedDate(day.date);
      }}
    >
      <Text style={[{ color: '#333' }, isSelectable ? {} : { color: 'red' }]}>
        {day.label}
      </Text>
    </TouchableOpacity>
  );
}

export default memo(DayView);
