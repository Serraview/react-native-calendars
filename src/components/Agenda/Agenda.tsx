import React, { memo, ReactElement, useEffect, useContext } from 'react';
import {
  FlatList,
  // FlatListProps,
  // ListRenderItem,
  // StyleProp,
  // ViewStyle,
} from 'react-native';
import { getDate, isSameMonth } from 'date-fns';
// import { Callback } from 'CalendarExample/src/utils/types';
import { DayControllerCtx, AgendaControllerCtx } from '../../contexts';
import Item from './Item';

// export type OwnProps = {
//   style?: StyleProp<ViewStyle>;
//   renderItem?: ListRenderItem<any> | null | undefined;
//   onDateSelected?: Callback<Date>;
// };

// type ExistingProps<ItemT> = {
//   data: ReadonlyArray<ItemT> | null | undefined;
//   keyExtractor?: (item: ItemT, index: number) => string;
//   renderItem: ListRenderItem<ItemT> | null | undefined;
// };
// type OmitedFlatListProps<ItemT = any> = Omit<
//   Omit<FlatListProps<ItemT>, keyof ExistingProps<ItemT>>,
//   keyof OwnProps
// >;

// export type AgendaProps = OwnProps & OmitedFlatListProps;

function Agenda(): ReactElement | null {
  const {
    listController,
    props: {
      // itemRenderer,
      onDateSelected,
      otherProps,
      onDateChange,
    },
  } = useContext(AgendaControllerCtx);
  const { selectedDate, setSelectedDate } = useContext(DayControllerCtx);

  // useEffect(() => {
  //   console.log('%c AGENDA FIRST', 'background: #222; color: #ba8965');
  // }, []);
  // useEffect(() => { console.log('%c @Agenda/useEffect[style,itemRenderer,onDateSelected, other]', 'background: #222; color: #3399dd'); }, [
  //   itemRenderer,
  //   onDateSelected, otherProps]);

  useEffect(() => {
    // console.log('@Agenda/useEffect[selectedDate]');
    if (
      listController &&
      isSameMonth(listController.month.date, selectedDate)
    ) {
      const index = getDate(selectedDate);
      listController.scrollToIndex(index - 1);
    }
  }, [selectedDate, listController]);

  useEffect(() => {
    // console.log('@Agenda/useEffect[listController]');
    if (listController) {
      listController.onDayChange = (date): void => {
        // console.log('@Agenda/onDayChange', { date });
        setSelectedDate(date);
        if (onDateChange) onDateChange(date);
      };
      listController.onDaySettled = (d): void => {
        if (onDateSelected) onDateSelected(d);
        // console.log('settled on ', { d });
      };
    }
  }, [listController]);

  if (!listController) return null;

  // console.log('%c RENDER @@@@@@@', 'background: #222; color: #bada55', { listController });

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: 'white' }}
      {...otherProps}
      ref={listController.listRef}
      data={listController.month.days}
      keyExtractor={(day): string => `agendaDay_${day.key}`}
      renderItem={(itemProps): ReactElement => <Item {...itemProps} />}
      initialNumToRender={listController.month.days.length}
      {...listController.flatListProps}
    />
  );
}

export default memo(Agenda);
