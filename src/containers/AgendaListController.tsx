import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useContext,
} from 'react';
import { isSameMonth } from 'date-fns';
import {
  MonthControllerCtx,
  AgendaControllerCtx,
  AgendaControllerPassedProps,
  AgendaControllerOmittedFlatListProps,
} from '../contexts';
import { AgendaListController } from '../utils';

export type AgendaControllerProps = AgendaControllerOmittedFlatListProps &
  AgendaControllerPassedProps;

function AgendaListWrapper({
  children,
  itemRenderer,
  eventRenderer,
  // onDateSelected,
  onDateChange,
  onItemPressed,
  onItemEventPressed,
  ...flatListProps
}: AgendaControllerProps & IBaseProps): ReactElement {
  const { currentMonth } = useContext(MonthControllerCtx);
  const [controller, setController] = useState<AgendaListController | null>(
    null
  );

  useEffect(() => {
    if (!controller || !isSameMonth(controller?.month.date, currentMonth.date))
      setController(new AgendaListController(currentMonth));
  }, [currentMonth]);

  return (
    <AgendaControllerCtx.Provider
      value={{
        listController: controller,
        props: {
          itemRenderer,
          eventRenderer,
          // onDateSelected,
          onDateChange,
          onItemPressed,
          onItemEventPressed,
          otherProps: flatListProps,
        },
      }}
    >
      {children}
    </AgendaControllerCtx.Provider>
  );
}

export default memo(AgendaListWrapper);
