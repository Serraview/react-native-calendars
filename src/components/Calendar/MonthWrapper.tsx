// import { getWeekDaysFromIndex, getShortName, TWeekDayIndexes } from 'CalendarExample/src/utils';
// import { getMonth, eachWeekOfInterval, startOfMonth, endOfMonth, format, getDate, isSameDay, addDays } from 'date-fns';
import React, { memo, ReactElement, useContext } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import MonthView from './MonthView';
import DayLabels from './DayLabels';
import { MONTH_ORDER } from '../../consts';
import { CalendarDimensionsCtx, MonthControllerCtx } from '../../contexts';
import MonthHeader from './MonthHeader';

type OwnProps = {
  order: MONTH_ORDER;
  style?: StyleProp<ViewStyle>;
};

type WrapperProps = Omit<OwnProps, keyof OwnProps>;

export type MonthWrapperProps = WrapperProps & OwnProps;

function MonthWrapper({
  order,
  style,
}: MonthWrapperProps): ReactElement | null {
  const { getByOrder } = useContext(MonthControllerCtx);

  const { updateMonthViewHeight } = useContext(CalendarDimensionsCtx);
  const month = getByOrder(order);
  if (!month) return null;
  return (
    <View
      style={[
        {
          paddingVertical: 5,
          // flex: 1,
          // width,
          // height
        },
        style,
      ]}
      onLayout={updateMonthViewHeight(month)}
      collapsable={false}
    >
      <MonthHeader label={month.label} />
      <DayLabels
        keyExtender={month.keyExtender}
        startingDayIndex={month.startingDay}
      />
      <MonthView month={month} />
    </View>
  );
}

export default memo(MonthWrapper);
